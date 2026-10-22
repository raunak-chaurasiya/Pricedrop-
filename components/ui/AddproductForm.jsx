"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/ui/AuthModal";
import { DEMO_PRODUCTS } from "@/lib/demoProducts";

export default function AddproductForm({ user, onProductAdded, onSelectDemo }) {
  const [productUrl, setProductUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleDemoClick = (demo) => {
    setProductUrl(demo.url);
    if (onSelectDemo) {
      onSelectDemo(demo);
    }
    toast.success(`Demo loaded: ${demo.shortLabel}! Check the live price trends below.`);
    const el = document.getElementById("demo-preview-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in first to track custom products!");
      setShowAuthModal(true);
      return;
    }

    if (!productUrl.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to extract and add product");
      }

      toast.success(data.message || "Product added to tracking list!");
      setProductUrl("");
      if (onProductAdded) {
        onProductAdded(data.product);
      }
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong while adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8">
        <div className="flex flex-col sm:flex-row gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-orange-100">
          <Input
            type="url"
            placeholder="Paste product link (Amazon, Flipkart, Myntra, etc.)..."
            className="h-12 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 placeholder:text-gray-400"
            required
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 h-12 px-7 text-white font-medium rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Track Price</span>
              </>
            )}
          </Button>
        </div>

        {/* 1-Click Try Demo Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Try 1-Click Demo:</span>
          </span>
          {DEMO_PRODUCTS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => handleDemoClick(demo)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/90 hover:bg-orange-50 text-gray-700 hover:text-orange-700 border border-orange-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>{demo.shortLabel}</span>
            </button>
          ))}
        </div>
      </form>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}