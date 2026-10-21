"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  TrendingDown,
  TrendingUp,
  Tag,
  Clock,
  LineChart,
  Images,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateDealVerdict } from "@/lib/dealAnalysis";

export default function PriceHistoryModal({
  product,
  isOpen,
  onClose,
  onRefresh,
  refreshing = false,
}) {
  const [activeTab, setActiveTab] = useState("chart"); // 'chart', 'gallery', 'features'
  const [timeframe, setTimeframe] = useState("MAX"); // '1M', '3M', '6M', 'MAX'
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!product) return null;

  const verdict = useMemo(() => calculateDealVerdict(product), [product]);

  // Resolve gallery images safely
  const galleryImages = useMemo(() => {
    let imgs = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      imgs = product.images.filter(
        (url) => typeof url === "string" && url.trim().length > 0
      );
    }
    if (imgs.length === 0 && product.image_url) {
      imgs = [product.image_url];
    }
    return imgs;
  }, [product]);

  // Resolve features list safely
  const featureList = useMemo(() => {
    if (Array.isArray(product.features) && product.features.length > 0) {
      return product.features.filter(
        (f) => typeof f === "string" && f.trim().length > 0
      );
    }
    return [];
  }, [product]);

  // Sort history chronologically
  const rawHistory = useMemo(() => {
    if (product.price_history && product.price_history.length > 0) {
      return [...product.price_history].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }
    return [{ price: product.current_price, created_at: product.created_at }];
  }, [product]);

  // Filter based on selected timeframe
  const filteredHistory = useMemo(() => {
    if (timeframe === "MAX") return rawHistory;
    const now = new Date();
    const daysMap = { "1M": 30, "3M": 90, "6M": 180 };
    const days = daysMap[timeframe] || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - days);

    const filtered = rawHistory.filter(
      (item) => new Date(item.created_at) >= cutoffDate
    );

    return filtered.length >= 2 ? filtered : rawHistory;
  }, [rawHistory, timeframe]);

  const formattedData = useMemo(() => {
    return filteredHistory.map((item) => {
      const d = new Date(item.created_at);
      return {
        date: d.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        fullDate: d.toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: Number(item.price),
      };
    });
  }, [filteredHistory]);

  const prices = filteredHistory.map((h) => Number(h.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = Number(product.current_price);
  const startPrice = Number(filteredHistory[0].price);
  const priceDifference = currentPrice - startPrice;
  const isDropped = priceDifference < 0;

  const nextImage = () => {
    if (galleryImages.length === 0) return;
    setSelectedImageIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (galleryImages.length === 0) return;
    setSelectedImageIdx((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 sm:p-7">
        <DialogHeader className="space-y-3">
          {/* Top Bar: Tabs & Action Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            {/* Tab Buttons */}
            <div className="flex items-center bg-gray-100/90 p-1 rounded-xl text-xs font-semibold gap-1 self-start sm:self-auto overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab("chart")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "chart"
                    ? "bg-white text-orange-600 shadow-xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Price Trend</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "gallery"
                    ? "bg-white text-orange-600 shadow-xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Images className="w-3.5 h-3.5" />
                <span>Images</span>
                {galleryImages.length > 0 && (
                  <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {galleryImages.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("features")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "features"
                    ? "bg-white text-orange-600 shadow-xs font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Features</span>
                {featureList.length > 0 && (
                  <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {featureList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="h-8 px-2.5 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 gap-1.5"
                  title="Refresh latest price and details"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      refreshing ? "animate-spin text-orange-500" : ""
                    }`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              )}

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100/80 transition-colors"
                title="View on original store"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Store</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Product Title Header */}
          <div className="flex items-start gap-3 pt-1">
            {product.image_url && (
              <div className="w-12 h-12 shrink-0 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 text-left">
                {product.title}
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-xs text-left mt-0.5">
                {activeTab === "chart" && "Price fluctuations and historical records"}
                {activeTab === "gallery" && `Product Gallery • ${galleryImages.length} photo${galleryImages.length === 1 ? "" : "s"}`}
                {activeTab === "features" && `Key Specifications & Highlights • ${featureList.length} items`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* TAB 1: PRICE CHART & STATS */}
        {activeTab === "chart" && (
          <div className="mt-3">
            {/* AI Deal Intelligence Card */}
            {verdict && (
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border mb-3.5 text-left transition-all ${
                  verdict.verdict === "BUY_NOW"
                    ? "bg-emerald-50/70 border-emerald-200"
                    : verdict.verdict === "FAIR_PRICE"
                    ? "bg-amber-50/70 border-amber-200"
                    : "bg-rose-50/70 border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles
                      className={`w-4 h-4 ${
                        verdict.verdict === "BUY_NOW"
                          ? "text-emerald-600"
                          : verdict.verdict === "FAIR_PRICE"
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      AI Deal Intelligence
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-gray-500">Deal Score</span>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-black ${
                        verdict.verdict === "BUY_NOW"
                          ? "bg-emerald-600 text-white"
                          : verdict.verdict === "FAIR_PRICE"
                          ? "bg-amber-600 text-white"
                          : "bg-rose-600 text-white"
                      }`}
                    >
                      {verdict.score}/100
                    </div>
                  </div>
                </div>

                {/* Verdict Title */}
                <h4
                  className={`text-sm sm:text-base font-extrabold flex items-center gap-1.5 ${
                    verdict.verdict === "BUY_NOW"
                      ? "text-emerald-900"
                      : verdict.verdict === "FAIR_PRICE"
                      ? "text-amber-950"
                      : "text-rose-950"
                  }`}
                >
                  {verdict.label}
                </h4>

                {/* Insight Description */}
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  {verdict.insight}
                </p>

                {/* Score Progress Bar */}
                <div className="w-full bg-gray-200/80 h-1.5 rounded-full overflow-hidden mt-2.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      verdict.verdict === "BUY_NOW"
                        ? "bg-emerald-500"
                        : verdict.verdict === "FAIR_PRICE"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${verdict.score}%` }}
                  />
                </div>
              </div>
            )}

            {/* Timeframe & Analytics Tag Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-xs tracking-wider uppercase bg-orange-50 px-2.5 py-1 rounded-md w-fit">
                <Tag className="w-3.5 h-3.5" /> Price Analytics
              </div>

              {/* Timeframe Filter Buttons */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto overflow-x-auto max-w-full">
                {["1M", "3M", "6M", "MAX"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      timeframe === tf
                        ? "bg-white text-orange-600 shadow-xs font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tf === "MAX" ? "Max" : `${tf.replace("M", "")}M`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 my-3">
              <div className="bg-orange-50/70 p-2.5 sm:p-3.5 rounded-xl border border-orange-100 text-left">
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium block">
                  Current
                </span>
                <p className="text-base sm:text-xl font-black text-gray-900 mt-0.5">
                  {product.currency}
                  {currentPrice.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-emerald-50/70 p-2.5 sm:p-3.5 rounded-xl border border-emerald-100 text-left">
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium block">
                  Lowest
                </span>
                <p className="text-base sm:text-xl font-black text-emerald-700 mt-0.5">
                  {product.currency}
                  {minPrice.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-rose-50/70 p-2.5 sm:p-3.5 rounded-xl border border-rose-100 text-left">
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium block">
                  Highest
                </span>
                <p className="text-base sm:text-xl font-black text-rose-700 mt-0.5">
                  {product.currency}
                  {maxPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Trend Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1 mb-2 text-xs">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  <strong>{filteredHistory.length}</strong> points (
                  {timeframe === "MAX" ? "Full History" : `${timeframe}`})
                </span>
              </div>

              {priceDifference !== 0 ? (
                <div
                  className={`flex items-center gap-1 font-semibold ${
                    isDropped ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isDropped ? (
                    <TrendingDown className="w-4 h-4 shrink-0" />
                  ) : (
                    <TrendingUp className="w-4 h-4 shrink-0" />
                  )}
                  <span>
                    {isDropped ? "Dropped by" : "Increased by"} {product.currency}{" "}
                    {Math.abs(priceDifference).toLocaleString("en-IN")}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500 font-medium">Price is steady</span>
              )}
            </div>

            {/* Chart Area */}
            <div className="h-56 sm:h-72 w-full bg-linear-to-b from-orange-50/20 via-white to-orange-50/10 rounded-2xl p-2 sm:p-4 border border-gray-100 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={formattedData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    stroke="#9ca3af"
                    fontSize={10}
                    dy={5}
                  />
                  <YAxis
                    tickLine={false}
                    stroke="#9ca3af"
                    fontSize={10}
                    domain={[
                      (dataMin) => Math.max(0, Math.floor(dataMin * 0.95)),
                      (dataMax) => Math.ceil(dataMax * 1.05),
                    ]}
                    tickFormatter={(val) => `${product.currency}${val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-gray-900 text-white px-3 py-2 rounded-xl shadow-xl border border-gray-800 text-xs">
                            <p className="text-gray-400 text-[10px]">{item.fullDate}</p>
                            <p className="font-extrabold text-orange-400 text-xs sm:text-sm mt-0.5">
                              {product.currency}{" "}
                              {Number(item.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="price"
                    stroke="#f97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                    dot={{
                      r: 2.5,
                      fill: "#f97316",
                      strokeWidth: 1,
                      stroke: "#ffffff",
                    }}
                    activeDot={{ r: 5, fill: "#ea580c" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT IMAGES GALLERY */}
        {activeTab === "gallery" && (
          <div className="mt-3 space-y-4">
            {galleryImages.length > 0 ? (
              <div>
                {/* Main Image Viewer */}
                <div className="relative w-full h-64 sm:h-80 bg-gray-50/80 rounded-2xl border border-gray-200/80 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={galleryImages[selectedImageIdx] || galleryImages[0]}
                    alt={`${product.title} - ${selectedImageIdx + 1}`}
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300"
                  />

                  {/* Previous / Next Navigation Arrows */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200/70 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200/70 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Image Counter Badge */}
                  <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                    {selectedImageIdx + 1} / {galleryImages.length}
                  </div>
                </div>

                {/* Thumbnails Strip */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto p-1 mt-3">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-gray-50 p-1.5 border transition-all cursor-pointer overflow-hidden ${
                          selectedImageIdx === idx
                            ? "border-orange-500 ring-2 ring-orange-200 shadow-sm scale-102"
                            : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/60 border border-dashed border-gray-200 rounded-2xl">
                <PackageOpen className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 text-sm">No images found</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  We haven&apos;t captured extra photos for this product yet. Click refresh to scan again.
                </p>
                {onRefresh && (
                  <Button
                    onClick={onRefresh}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh Images
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCT FEATURES & HIGHLIGHTS */}
        {activeTab === "features" && (
          <div className="mt-3 space-y-3">
            {featureList.length > 0 ? (
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {featureList.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-orange-50/30 hover:bg-orange-50/60 border border-orange-100/70 p-3 sm:p-3.5 rounded-xl transition-colors text-left"
                  >
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/60 border border-dashed border-gray-200 rounded-2xl">
                <Sparkles className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 text-sm">
                  No features extracted yet
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  This product was added before specifications extraction was enabled. Click the refresh button to retrieve its key features.
                </p>
                {onRefresh && (
                  <Button
                    onClick={onRefresh}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs gap-1.5 text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    Extract Features Now
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
