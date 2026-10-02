"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  RefreshCw,
  Trash2,
  TrendingDown,
  TrendingUp,
  LineChart,
} from "lucide-react";
import { toast } from "sonner";
import PriceHistoryModal from "@/components/ui/PriceHistoryChart";

export default function ProductCard({ product, onProductUpdated, onProductDeleted }) {
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const currentPrice = Number(product.current_price);
  const lowestPrice = product.lowest_price ? Number(product.lowest_price) : currentPrice;
  const highestPrice = product.highest_price ? Number(product.highest_price) : currentPrice;

  // Calculate discount or price drop relative to highest
  const priceDropPct = highestPrice > currentPrice
    ? Math.round(((highestPrice - currentPrice) / highestPrice) * 100)
    : 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to refresh");
      toast.success("Price updated to " + product.currency + " " + data.product.current_price);
      if (onProductUpdated) onProductUpdated(data.product);
    } catch (err) {
      toast.error(err.message || "Could not refresh price");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to stop tracking this product?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      toast.success("Product deleted");
      if (onProductDeleted) onProductDeleted(product.id);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
        <div className="p-5">
          {/* Header Image & Badge */}
          <div className="relative w-full h-44 bg-gray-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-2">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="text-gray-300 font-medium text-xs">No image available</div>
            )}

            {priceDropPct > 0 && (
              <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <TrendingDown className="w-3 h-3" /> {priceDropPct}% OFF Peak
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-snug mb-3">
            {product.title}
          </h3>

          {/* Price details */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-gray-900">
              {product.currency} {currentPrice.toLocaleString("en-IN")}
            </span>
            {highestPrice > currentPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.currency} {highestPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* High / Low pills */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="flex-1 text-center">
              <span className="text-[10px] uppercase text-gray-400 block font-medium">Lowest</span>
              <span className="font-semibold text-emerald-600">
                {product.currency} {lowestPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="w-[1px] h-6 bg-gray-200" />
            <div className="flex-1 text-center">
              <span className="text-[10px] uppercase text-gray-400 block font-medium">Highest</span>
              <span className="font-semibold text-gray-700">
                {product.currency} {highestPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(true)}
            className="text-xs text-gray-700 border-gray-200 hover:bg-orange-50 hover:text-orange-600 gap-1.5 flex-1"
          >
            <LineChart className="w-3.5 h-3.5" />
            History
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
            title="Refresh Price"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-orange-500" : ""}`} />
          </Button>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Open Store Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <PriceHistoryModal
        product={product}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </>
  );
}
