"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Download,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Sparkles,
  TrendingDown,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { calculateDealVerdict } from "@/lib/dealAnalysis";

export default function ShareDealModal({ product, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  if (!product) return null;

  const currentPrice = Number(product.current_price) || 0;
  const lowestPrice = product.lowest_price ? Number(product.lowest_price) : currentPrice;
  const highestPrice = product.highest_price ? Number(product.highest_price) : currentPrice;
  const currency = product.currency || "₹";

  const priceDropPct =
    highestPrice > currentPrice
      ? Math.round(((highestPrice - currentPrice) / highestPrice) * 100)
      : 0;

  const dealVerdict = calculateDealVerdict(product);

  // Formatted share message text
  const shareMessage = `🔥 *Price Drop Alert on DealDrop!*

📦 *${product.title}*
💰 Current Price: *${currency}${currentPrice.toLocaleString("en-IN")}*${highestPrice > currentPrice
      ? ` (Peak was ${currency}${highestPrice.toLocaleString("en-IN")})`
      : ""
    }
📉 Lowest Ever Recorded: *${currency}${lowestPrice.toLocaleString("en-IN")}*${priceDropPct > 0 ? ` (${priceDropPct}% OFF Peak!)` : ""
    }
✨ AI Verdict: *${dealVerdict?.label || "Good Deal"}* (Score: ${dealVerdict?.score || 70}/100)

🔗 Track or Buy here: ${product.url}`;

  // 1. Share via WhatsApp
  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareMessage
    )}`;
    window.open(url, "_blank");
  };

  // 2. Copy deal summary text
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      toast.success("Deal summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy deal text");
    }
  };

  // 3. Native mobile share sheet
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Deal Alert: ${product.title}`,
          text: shareMessage,
          url: product.url,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Share canceled or not supported");
        }
      }
    } else {
      handleCopyText();
    }
  };

  // 4. Download Story Card as High-Res PNG using HTML5 Canvas
  const handleDownloadCard = async () => {
    setDownloading(true);
    try {
      const width = 640;
      const height = 800;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Draw modern dark gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#090d16");
      bgGrad.addColorStop(0.5, "#111827");
      bgGrad.addColorStop(1, "#1c1917");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top decorative glowing accent
      const accentGrad = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 300);
      accentGrad.addColorStop(0, "rgba(249, 115, 22, 0.35)");
      accentGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
      ctx.fillStyle = accentGrad;
      ctx.fillRect(0, 0, width, 300);

      // Card border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, width - 2, height - 2);

      // Header: App Branding
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("🔥 DealDrop", 40, 50);

      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px sans-serif";
      ctx.fillText("SMART PRICE INTELLIGENCE", 160, 50);

      // Product Image Container Box
      const imgBoxX = 40;
      const imgBoxY = 75;
      const imgBoxW = width - 80;
      const imgBoxH = 300;

      ctx.fillStyle = "#ffffff";
      roundRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 20);
      ctx.fill();

      // Draw image inside or fallback icon
      if (product.image_url) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = product.image_url;
          });
          // Draw image centered with aspect ratio contain
          const hRatio = (imgBoxW - 40) / img.width;
          const vRatio = (imgBoxH - 40) / img.height;
          const ratio = Math.min(hRatio, vRatio, 1);
          const drawW = img.width * ratio;
          const drawH = img.height * ratio;
          const drawX = imgBoxX + (imgBoxW - drawW) / 2;
          const drawY = imgBoxY + (imgBoxH - drawH) / 2;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } catch {
          // If cross-origin prevents canvas image drawing, draw nice placeholder
          ctx.fillStyle = "#f3f4f6";
          ctx.fillRect(imgBoxX + 10, imgBoxY + 10, imgBoxW - 20, imgBoxH - 20);
          ctx.fillStyle = "#f97316";
          ctx.font = "bold 32px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🛍️ " + product.title.slice(0, 20), width / 2, imgBoxY + imgBoxH / 2);
          ctx.textAlign = "left";
        }
      }

      // AI Deal Verdict Badge
      const badgeY = 405;
      ctx.fillStyle = dealVerdict?.verdict === "BUY_NOW" ? "#065f46" : dealVerdict?.verdict === "FAIR_PRICE" ? "#78350f" : "#881337";
      roundRect(ctx, 40, badgeY, width - 80, 44, 12);
      ctx.fill();

      ctx.fillStyle = dealVerdict?.verdict === "BUY_NOW" ? "#34d399" : dealVerdict?.verdict === "FAIR_PRICE" ? "#fbbf24" : "#f87171";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(
        `✨ AI Verdict: ${dealVerdict?.label || "Deal Tracked"} (Score: ${dealVerdict?.score || 70}/100)`,
        55,
        badgeY + 28
      );

      // Product Title (2-line wrap)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      const titleWords = product.title.split(" ");
      let line1 = "";
      let line2 = "";
      for (const word of titleWords) {
        if (ctx.measureText(line1 + word).width < width - 100) {
          line1 += word + " ";
        } else if (ctx.measureText(line2 + word).width < width - 100) {
          line2 += word + " ";
        }
      }
      ctx.fillText(line1.trim(), 40, 490);
      if (line2) ctx.fillText(line2.trim() + (titleWords.length > 10 ? "..." : ""), 40, 522);

      // Price Section
      const priceY = 575;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(`${currency}${currentPrice.toLocaleString("en-IN")}`, 40, priceY);

      // Strike-through peak price if discounted
      if (highestPrice > currentPrice) {
        const currentPriceWidth = ctx.measureText(`${currency}${currentPrice.toLocaleString("en-IN")}`).width;
        ctx.fillStyle = "#6b7280";
        ctx.font = "22px sans-serif";
        const peakText = `${currency}${highestPrice.toLocaleString("en-IN")}`;
        const peakX = 40 + currentPriceWidth + 16;
        ctx.fillText(peakText, peakX, priceY - 5);
        ctx.fillRect(peakX, priceY - 12, ctx.measureText(peakText).width, 2);

        // Discount pill
        if (priceDropPct > 0) {
          ctx.fillStyle = "#10b981";
          roundRect(ctx, peakX + ctx.measureText(peakText).width + 12, priceY - 26, 95, 26, 6);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px sans-serif";
          ctx.fillText(`-${priceDropPct}% OFF`, peakX + ctx.measureText(peakText).width + 24, priceY - 9);
        }
      }

      // Stats Pills Box
      const statsY = 620;
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      roundRect(ctx, 40, statsY, width - 80, 70, 14);
      ctx.fill();

      ctx.fillStyle = "#9ca3af";
      ctx.font = "12px sans-serif";
      ctx.fillText("ALL-TIME LOWEST", 60, statsY + 28);
      ctx.fillText("ALL-TIME HIGHEST", width / 2 + 20, statsY + 28);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`${currency}${lowestPrice.toLocaleString("en-IN")}`, 60, statsY + 54);

      ctx.fillStyle = "#f87171";
      ctx.fillText(`${currency}${highestPrice.toLocaleString("en-IN")}`, width / 2 + 20, statsY + 54);

      // Footer
      ctx.fillStyle = "#6b7280";
      ctx.font = "13px sans-serif";
      ctx.fillText("Track live price drops at dealdrop-tracker.vercel.app", 40, 750);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `dealdrop-${product.title.slice(0, 20).replace(/\s+/g, "-")}.png`;
      a.click();
      toast.success("Deal card downloaded as PNG!");
    } catch (err) {
      console.error(err);
      toast.error("Could not download image. Try sharing text instead!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-1.25rem)] max-w-[calc(100vw-1.25rem)] sm:max-w-lg max-h-[92vh] overflow-y-auto overflow-x-hidden bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 sm:p-6">
        <DialogHeader className="pr-8 sm:pr-8">
          <div className="flex items-center gap-2 text-orange-600 font-semibold text-xs tracking-wider uppercase bg-orange-50 px-2.5 py-1 rounded-md w-fit">
            <Share2 className="w-3.5 h-3.5" /> Share Deal Card
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 text-left mt-1">
            Share Deal with Friends
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs text-left">
            Post to WhatsApp, Instagram Story, or copy a quick deal summary.
          </DialogDescription>
        </DialogHeader>

        {/* Visual Deal Card Preview (4:5 story aspect ratio) */}
        <div
          ref={cardRef}
          className="my-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-stone-900 text-white shadow-xl border border-gray-800 relative overflow-hidden"
        >
          {/* Top glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-orange-500/20 blur-2xl pointer-events-none" />

          {/* Card Header Branding */}
          <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
            <div className="flex items-center gap-1.5 text-orange-400 font-black text-sm tracking-tight">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>DealDrop</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">
              Price Alert
            </span>
          </div>

          {/* Product Image */}
          <div className="w-full h-40 bg-white rounded-xl p-2.5 flex items-center justify-center overflow-hidden mb-3">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="text-gray-400 text-xs">Product Image</div>
            )}
          </div>

          {/* AI Verdict Pill */}
          {dealVerdict && (
            <div
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold mb-2.5 border ${dealVerdict.verdict === "BUY_NOW"
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                : dealVerdict.verdict === "FAIR_PRICE"
                  ? "bg-amber-950/70 border-amber-500/40 text-amber-300"
                  : "bg-rose-950/70 border-rose-500/40 text-rose-300"
                }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">AI: {dealVerdict.label}</span>
              </div>
              <span className="shrink-0 bg-white/20 px-1.5 py-0.2 rounded-md text-[10px]">
                Score {dealVerdict.score}/100
              </span>
            </div>
          )}

          {/* Product Title */}
          <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug mb-2 text-left">
            {product.title}
          </h4>

          {/* Price & Discounts */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {currency} {currentPrice.toLocaleString("en-IN")}
            </span>
            {highestPrice > currentPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {currency} {highestPrice.toLocaleString("en-IN")}
                </span>
                {priceDropPct > 0 && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> {priceDropPct}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          {/* Lowest vs Highest Bar */}
          <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 p-2 rounded-xl text-xs">
            <div className="text-left">
              <span className="text-[10px] uppercase text-gray-400 block font-medium">All-time Low</span>
              <span className="font-bold text-emerald-400">
                {currency} {lowestPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase text-gray-400 block font-medium">All-time High</span>
              <span className="font-bold text-rose-400">
                {currency} {highestPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-2">
          {/* WhatsApp Share */}
          <Button
            onClick={handleWhatsAppShare}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs h-10 shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Share WhatsApp
          </Button>

          {/* Download PNG Story Card */}
          <Button
            onClick={handleDownloadCard}
            disabled={downloading}
            variant="outline"
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 font-bold gap-2 text-xs h-10 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Creating..." : "Save PNG Card"}
          </Button>

          {/* Copy Text */}
          <Button
            onClick={handleCopyText}
            variant="secondary"
            className="w-full text-gray-700 font-semibold gap-2 text-xs h-9 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Summary"}
          </Button>

          {/* Native Share Sheet */}
          <Button
            onClick={handleNativeShare}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-900 font-semibold gap-1.5 text-xs h-9 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            More Options
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper to draw rounded rectangles on HTML5 canvas
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
