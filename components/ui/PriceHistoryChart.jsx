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
import { TrendingDown, TrendingUp, Calendar, Tag, Clock } from "lucide-react";

export default function PriceHistoryModal({ product, isOpen, onClose }) {
  const [timeframe, setTimeframe] = useState("MAX"); // '1M', '3M', '6M', 'MAX'

  if (!product) return null;

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

    // If filtering leaves less than 2 points, fallback to rawHistory
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 sm:p-7">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 mt-2 text-left">
            {product.title}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs text-left">
            Price fluctuations and historical records
          </DialogDescription>
        </DialogHeader>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 my-3 sm:my-4">
          <div className="bg-orange-50/70 p-2.5 sm:p-3.5 rounded-xl border border-orange-100 text-left">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium block">Current</span>
            <p className="text-base sm:text-xl font-black text-gray-900 mt-0.5">
              {product.currency}{currentPrice.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-emerald-50/70 p-2.5 sm:p-3.5 rounded-xl border border-emerald-100 text-left">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium block">Lowest</span>
            <p className="text-base sm:text-xl font-black text-emerald-700 mt-0.5">
              {product.currency}{minPrice.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-rose-50/70 p-2.5 sm:p-3.5 rounded-xl border border-rose-100 text-left">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium block">Highest</span>
            <p className="text-base sm:text-xl font-black text-rose-700 mt-0.5">
              {product.currency}{maxPrice.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Trend Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1 mb-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>
              <strong>{filteredHistory.length}</strong> points ({timeframe === "MAX" ? "Full History" : `${timeframe}`})
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
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                domain={[(dataMin) => Math.max(0, Math.floor(dataMin * 0.95)), (dataMax) => Math.ceil(dataMax * 1.05)]}
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
                          {product.currency} {Number(item.price).toLocaleString("en-IN")}
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
                dot={{ r: 2.5, fill: "#f97316", strokeWidth: 1, stroke: "#ffffff" }}
                activeDot={{ r: 5, fill: "#ea580c" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
