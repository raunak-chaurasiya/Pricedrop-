import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API || process.env.FIRECRAWL_API_KEY,
});

/**
 * Scrapes product details using Firecrawl v2 API
 * @param {string} url - Product URL
 * @returns {Promise<{ title: string, price: number, currency: string, image_url: string }>}
 */
export async function extractProductDetails(url) {
  try {
    const productSchema = {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'The exact title or name of the product' },
        price: { type: 'number', description: 'Current numeric price of the product without currency symbols or commas' },
        currency: { type: 'string', description: 'Currency symbol (e.g. ₹, $, £, €)' },
        image_url: { type: 'string', description: 'Direct image URL of the main product picture' },
        images: {
          type: 'array',
          items: { type: 'string' },
          description: 'High-resolution direct image URLs for product gallery and different angles',
        },
        features: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key features, bullet points, technical specifications or highlights of the product',
        },
      },
      required: ['title', 'price'],
    };

    // Firecrawl v2 scrape call with json object format
    const response = await firecrawl.scrape(url, {
      formats: [
        {
          type: 'json',
          schema: productSchema,
          prompt: 'Extract the main product title, current numeric price (as clean number), currency symbol, main product image URL, an array of all product gallery images, and a clean list of key specifications/features.',
        },
        'markdown',
      ],
    });

    let extractedData = response?.json || response?.data?.json || null;

    // If json wasn't extracted directly, try to parse metadata or markdown fallback
    let title = extractedData?.title || response?.metadata?.title || response?.metadata?.ogTitle || 'Tracked Product';
    let price = extractedData?.price ? parseFloat(extractedData.price) : 0;
    let currency = extractedData?.currency || '₹';
    let image_url = extractedData?.image_url || response?.metadata?.ogImage || response?.metadata?.image || '';

    // Collect gallery images
    let images = [];
    if (Array.isArray(extractedData?.images)) {
      images = extractedData.images.filter(
        (img) => typeof img === 'string' && img.startsWith('http')
      );
    }
    if (image_url && !images.includes(image_url)) {
      images.unshift(image_url);
    }

    // Collect features
    let features = [];
    if (Array.isArray(extractedData?.features)) {
      features = extractedData.features
        .map((f) => (typeof f === 'string' ? f.trim() : ''))
        .filter((f) => f.length > 0);
    }

    // Fallback: If price is still 0, try to extract price from markdown text using regex
    if (!price && response?.markdown) {
      const priceMatch = response.markdown.match(/(?:₹|Rs\.?|INR|\$)\s?([\d,]+(?:\.\d+)?)/i);
      if (priceMatch && priceMatch[1]) {
        price = parseFloat(priceMatch[1].replace(/,/g, '')) || 0;
      }
    }

    // Fallback for features from markdown if JSON extraction missed it
    if (features.length === 0 && response?.markdown) {
      const bulletMatches = response.markdown.match(/^[*-]\s+(.+)$/gm);
      if (bulletMatches) {
        features = bulletMatches
          .map((b) => b.replace(/^[*-]\s+/, '').trim())
          .filter((b) => b.length > 5 && b.length < 250)
          .slice(0, 8);
      }
    }

    if (!title || title === 'Tracked Product') {
      if (response?.metadata?.title) {
        title = response.metadata.title;
      }
    }

    return {
      title: title.replace(/\s+/g, ' ').trim(),
      price: price || 0,
      currency: currency || '₹',
      image_url: image_url || (images[0] || ''),
      images: images.length > 0 ? images : (image_url ? [image_url] : []),
      features: features || [],
    };
  } catch (error) {
    console.error('Firecrawl extraction error:', error);
    throw new Error(error.message || 'Failed to extract product details with Firecrawl');
  }
}
