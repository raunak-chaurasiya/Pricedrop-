import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { extractProductDetails } from '@/lib/firecrawl';

export const maxDuration = 300; // Allow up to 5 minutes for cron execution

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Optional: Protect cron route if CRON_SECRET is set
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // 1. Fetch all tracked products across all users
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, url, current_price, lowest_price, highest_price, title');

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ message: 'No products to track at this time.' });
    }

    const results = [];

    // 2. Refresh each product price
    for (const product of products) {
      try {
        const extracted = await extractProductDetails(product.url);
        const newPrice = extracted.price || product.current_price;

        if (newPrice > 0) {
          const lowest_price = product.lowest_price
            ? Math.min(product.lowest_price, newPrice)
            : newPrice;
          const highest_price = product.highest_price
            ? Math.max(product.highest_price, newPrice)
            : newPrice;

          // Update product record
          await supabase
            .from('products')
            .update({
              current_price: newPrice,
              lowest_price,
              highest_price,
              updated_at: new Date().toISOString(),
            })
            .eq('id', product.id);

          // Insert new price point into history
          await supabase.from('price_history').insert({
            product_id: product.id,
            price: newPrice,
            created_at: new Date().toISOString(),
          });

          results.push({
            id: product.id,
            title: product.title,
            oldPrice: product.current_price,
            newPrice,
            status: 'updated',
          });
        }
      } catch (err) {
        console.error(`Failed to refresh product ${product.id}:`, err);
        results.push({
          id: product.id,
          title: product.title,
          error: err.message,
          status: 'failed',
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalTracked: products.length,
      updatedCount: results.filter((r) => r.status === 'updated').length,
      results,
    });
  } catch (err) {
    console.error('Cron job error:', err);
    return NextResponse.json({ error: err.message || 'Internal Cron Error' }, { status: 500 });
  }
}
