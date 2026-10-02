import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { extractProductDetails } from '@/lib/firecrawl';

// DELETE: Remove tracked product
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Product removed' });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to delete' }, { status: 500 });
  }
}

// POST: Re-scrape latest price and record price history
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 2. Scrape latest price with Firecrawl
    const extracted = await extractProductDetails(product.url);
    const newPrice = extracted.price || product.current_price;

    const lowest_price = product.lowest_price ? Math.min(product.lowest_price, newPrice) : newPrice;
    const highest_price = product.highest_price ? Math.max(product.highest_price, newPrice) : newPrice;

    // 3. Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        current_price: newPrice,
        lowest_price,
        highest_price,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 4. Record new price history entry
    await supabase.from('price_history').insert({
      product_id: id,
      price: newPrice,
    });

    return NextResponse.json({ product: updatedProduct, message: 'Price refreshed successfully!' });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to refresh price' }, { status: 500 });
  }
}
