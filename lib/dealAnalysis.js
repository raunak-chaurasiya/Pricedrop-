/**
 * AI Deal Intelligence & Verdict Engine
 * Calculates whether a product is a strong buy, fair deal, or should be waited on
 * based on all-time low, high, and current price movements.
 */

export function calculateDealVerdict(product) {
  if (!product) return null;

  const current = Number(product.current_price) || 0;
  const lowest = Number(product.lowest_price) || current;
  const highest = Number(product.highest_price) || current;
  const currency = product.currency || '₹';

  // If newly tracked or no price variation recorded yet
  if (highest <= lowest || highest === 0) {
    return {
      score: 70,
      verdict: 'FAIR_PRICE',
      label: 'Monitoring Active • Fair Price',
      shortLabel: 'Fair Price',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      accentColor: 'blue',
      insight: `Tracking active. Currently at ${currency}${current.toLocaleString('en-IN')}. We'll alert you as soon as the price moves.`,
      savingsFromPeak: 0,
      gapFromLowest: 0,
      percentFromLowest: 0,
      discountFromPeakPct: 0,
    };
  }

  // Position between 0 (lowest) and 1 (highest)
  const range = highest - lowest;
  const position = Math.max(0, Math.min(1, (current - lowest) / range));

  // Score from 0 to 100 (100 = at all-time low)
  const rawScore = Math.round((1 - position) * 100);

  const savingsFromPeak = Math.max(0, highest - current);
  const gapFromLowest = Math.max(0, current - lowest);
  const percentFromLowest = lowest > 0 ? Math.round((gapFromLowest / lowest) * 100) : 0;
  const discountFromPeakPct = highest > 0 ? Math.round((savingsFromPeak / highest) * 100) : 0;

  // 1. BUY NOW: Price is at or very close to all-time low (within 5%)
  if (gapFromLowest === 0 || percentFromLowest <= 5) {
    return {
      score: Math.max(88, rawScore),
      verdict: 'BUY_NOW',
      label: 'Great Time to Buy!',
      shortLabel: 'Buy Now',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pillColor: 'bg-emerald-600 text-white',
      accentColor: 'emerald',
      insight:
        gapFromLowest === 0
          ? `🔥 All-time lowest price recorded! At ${currency}${current.toLocaleString('en-IN')}, this is the absolute best deal recorded (${discountFromPeakPct}% off peak).`
          : `⚡ Highly recommended deal! Currently just ${currency}${gapFromLowest.toLocaleString('en-IN')} away from its all-time record low. Excellent time to purchase.`,
      savingsFromPeak,
      gapFromLowest,
      percentFromLowest,
      discountFromPeakPct,
    };
  }

  // 2. FAIR PRICE: Price is in lower-to-mid range (<= 45% of price range)
  if (position <= 0.45) {
    return {
      score: Math.max(55, Math.min(84, rawScore)),
      verdict: 'FAIR_PRICE',
      label: 'Fair Price • Good Deal',
      shortLabel: 'Fair Price',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      pillColor: 'bg-amber-600 text-white',
      accentColor: 'amber',
      insight: `Reasonable deal. It is ${currency}${savingsFromPeak.toLocaleString('en-IN')} below its highest price, but has previously touched ${currency}${lowest.toLocaleString('en-IN')} during sale events.`,
      savingsFromPeak,
      gapFromLowest,
      percentFromLowest,
      discountFromPeakPct,
    };
  }

  // 3. WAIT & WATCH: Price is in upper range or near peak
  return {
    score: Math.min(48, Math.max(15, rawScore)),
    verdict: 'WAIT',
    label: 'Wait for Price Drop',
    shortLabel: 'Wait & Watch',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    pillColor: 'bg-rose-600 text-white',
    accentColor: 'rose',
    insight: `⚠️ Price is currently near its peak (${currency}${highest.toLocaleString('en-IN')}). In past records, it dipped to ${currency}${lowest.toLocaleString('en-IN')} (saving ${currency}${savingsFromPeak.toLocaleString('en-IN')}). We advise waiting for a discount.`,
    savingsFromPeak,
    gapFromLowest,
    percentFromLowest,
    discountFromPeakPct,
  };
}
