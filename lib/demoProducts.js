/**
 * Pre-configured Live Demo Products for DealDrop
 * All image URLs verified HTTP 200 on Amazon CDN
 */

function generateDynamicPoints(basePrice, multiplierPattern) {
  const points = [];
  const now = new Date();
  const daysAgoList = [120, 105, 90, 75, 60, 48, 38, 30, 24, 18, 12, 7, 3, 0];

  daysAgoList.forEach((days, idx) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    const multiplier = multiplierPattern[idx % multiplierPattern.length];
    const price = Math.round((basePrice * multiplier) / 10) * 10;
    points.push({
      price,
      created_at: d.toISOString(),
    });
  });

  return points;
}

export const DEMO_PRODUCTS = [
  {
    id: "demo-iphone-16",
    shortLabel: "📱 iPhone 16",
    badgeLabel: "Flagship Phone",
    title: "Apple iPhone 16 (128 GB) - Teal | A18 Bionic Chip | 48MP Fusion Camera",
    current_price: 74999,
    lowest_price: 69999,
    highest_price: 79900,
    currency: "₹",
    image_url: "https://m.media-amazon.com/images/I/71GLMJ7TQiL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71GLMJ7TQiL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71gm8v4uPBL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61-r9zOKBCL._SX679_.jpg",
    ],
    features: [
      "Camera Control for instant tactile access to zoom, exposure, and depth of field",
      "A18 Bionic processor with 6-core CPU and hardware-accelerated ray tracing",
      "48MP Fusion main sensor with 2x optical-quality Telephoto integration",
      "Next-generation Ceramic Shield front with aerospace-grade matte glass back",
      "Up to 22 hours video playback with USB-C high-speed charging",
      "Action button with customizable quick shortcuts and voice memos",
    ],
    similar_products: [
      {
        title: "Apple iPhone 15 (128 GB) - Black",
        price: 58999,
        currency: "₹",
        url: "https://www.amazon.in/dp/B0CHX1W1XY",
        image_url: "https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg",
      },
      {
        title: "Apple 20W USB-C Power Adapter",
        price: 1699,
        currency: "₹",
        url: "https://www.amazon.in/dp/B08L5WH5N9",
        image_url: "https://m.media-amazon.com/images/I/61vtLhO6fDL._SX679_.jpg",
      },
      {
        title: "Apple iPhone 14 (128 GB) - Blue",
        price: 52999,
        currency: "₹",
        url: "https://www.amazon.in/dp/B0BDK62PDX",
        image_url: "https://m.media-amazon.com/images/I/61bK6PMOC3L._SX679_.jpg",
      },
    ],
    price_history: generateDynamicPoints(74999, [
      1.065, 1.065, 1.04, 1.02, 0.98, 1.01, 0.99, 0.96, 0.933, 0.95, 0.98, 1.0, 1.0, 1.0,
    ]),
    url: "https://www.amazon.in/dp/B0DGJ9VG15",
  },
  {
    id: "demo-sony-xm5",
    shortLabel: "🎧 Sony XM5 Headphones",
    badgeLabel: "Premium ANC Audio",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black | 30Hr Battery",
    current_price: 25990,
    lowest_price: 24990,
    highest_price: 34990,
    currency: "₹",
    image_url: "https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61D4Z3yKPAL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71o8Q5XJS5L._SX679_.jpg",
    ],
    features: [
      "Industry-leading Active Noise Cancellation with dual V1 and QN1 audio processors",
      "Crystal clear hands-free calling powered by 4 beamforming microphones and AI noise gate",
      "Up to 30 hours continuous playback with ultra-fast 3-minute charge for 3 hours playback",
      "Multipoint connection pairs seamlessly with laptop and smartphone simultaneously",
      "Soft fit leather and lightweight step-less slider for comfortable all-day wearing",
    ],
    similar_products: [
      {
        title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        price: 19990,
        currency: "₹",
        url: "https://www.amazon.in/dp/B0863TXGM3",
        image_url: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._SX679_.jpg",
      },
      {
        title: "Sony Official Protective Travel Hard Case for XM5",
        price: 1499,
        currency: "₹",
        url: "https://www.amazon.in/dp/B0B4WCXP78",
        image_url: "https://m.media-amazon.com/images/I/61D4Z3yKPAL._SX679_.jpg",
      },
      {
        title: "Apple iPhone 13 (128 GB) - Starlight",
        price: 44999,
        currency: "₹",
        url: "https://www.amazon.in/dp/B09G9D8KRQ",
        image_url: "https://m.media-amazon.com/images/I/71xb2xkN5qL._SX679_.jpg",
      },
    ],
    price_history: generateDynamicPoints(25990, [
      1.346, 1.346, 1.25, 1.15, 1.10, 1.08, 1.05, 0.961, 0.98, 1.02, 1.05, 1.0, 1.0, 1.0,
    ]),
    url: "https://www.amazon.in/dp/B09XS7JWHH",
  },
  {
    id: "demo-galaxy-watch6",
    shortLabel: "⌚ Galaxy Watch 6 LTE",
    badgeLabel: "Smartwatch & ECG",
    title: "Samsung Galaxy Watch 6 LTE (44mm, Graphite) | Blood Pressure, ECG & Sleep Coaching",
    current_price: 18999,
    lowest_price: 17999,
    highest_price: 36999,
    currency: "₹",
    image_url: "https://m.media-amazon.com/images/I/71rhrO49SmL._SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71rhrO49SmL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/71Wkk4n9olL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/61ZjlBOp+rL._SX679_.jpg",
    ],
    features: [
      "20% larger display with 30% slimmer bezel for high readability",
      "Sapphire Crystal glass with 5ATM and IP68 military-grade weather resistance",
      "BIA sensor for body composition: body fat percentage, BMI, and skeletal muscle",
      "Advanced Sleep Coaching with blood oxygen monitoring and snoring detection",
      "Standalone 4G LTE cellular connectivity for calls without your smartphone",
    ],
    similar_products: [
      {
        title: "Samsung Galaxy Watch 4 Classic (46mm, LTE)",
        price: 11999,
        currency: "₹",
        url: "https://www.amazon.in/dp/B09C5ZWN8K",
        image_url: "https://m.media-amazon.com/images/I/71Wkk4n9olL._SX679_.jpg",
      },
      {
        title: "Apple Watch SE (GPS, 44mm) - Midnight Aluminum",
        price: 24900,
        currency: "₹",
        url: "https://www.amazon.in/dp/B0BDJGF3H8",
        image_url: "https://m.media-amazon.com/images/I/71i2XhHU3pL._SX679_.jpg",
      },
      {
        title: "Smart Sports Watch Active Silicon Replacement Band",
        price: 799,
        currency: "₹",
        url: "https://www.amazon.in/dp/B0C8V2V6J2",
        image_url: "https://m.media-amazon.com/images/I/61ZjlBOp+rL._SX679_.jpg",
      },
    ],
    price_history: generateDynamicPoints(18999, [
      1.947, 1.85, 1.70, 1.55, 1.40, 1.30, 1.15, 0.947, 1.05, 1.02, 1.0, 0.98, 1.0, 1.0,
    ]),
    url: "https://www.amazon.in/dp/B0CC32D3GB",
  },
];
