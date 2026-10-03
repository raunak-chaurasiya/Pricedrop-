"use client";

import React, { useState } from "react";
import AddproductForm from "@/components/ui/AddproductForm";
import ProductCard from "@/components/ui/ProductCard";
import { Rabbit, Shield, Bell, PackageOpen, Sparkles } from "lucide-react";

export default function Dashboard({ initialUser, initialProducts = [] }) {
  const [user, setUser] = useState(initialUser);
  const [products, setProducts] = useState(initialProducts);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductDeleted = (deletedId) => {
    setProducts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast Extraction",
      description: "Extracts real-time product prices in seconds across major online stores.",
    },
    {
      icon: Shield,
      title: "Historical Tracking",
      description: "Stores continuous price records with interactive trend charts and timeframe analytics.",
    },
    {
      icon: Bell,
      title: "Drop Notifications",
      description: "Instantly detect when a product reaches its lowest recorded price.",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-orange-100/80 text-orange-800 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border border-orange-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Smart Price Intelligence • Real-Time Deal Tracker</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Never Miss a Price Drop Again
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mt-4 leading-relaxed">
          Paste any product URL to automatically extract details, track price changes over time, and view historical trend graphs.
        </p>

        {/* Input Form */}
        <AddproductForm user={user} onProductAdded={handleProductAdded} />
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto mt-16">
        {user && products.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Tracked Products</h2>
                <p className="text-sm text-gray-500">
                  {products.length} product{products.length === 1 ? "" : "s"} currently being tracked
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductUpdated={handleProductUpdated}
                  onProductDeleted={handleProductDeleted}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {user && (
              <div className="text-center py-10 bg-white/60 border border-dashed border-gray-300 rounded-2xl mb-12">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PackageOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No tracked products yet</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                  Paste a product link from Amazon, Flipkart, or any online store above to start tracking prices.
                </p>
              </div>
            )}

            {/* Features showcase */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:border-orange-200 transition-all"
                >
                  <div className="w-12 h-12 bg-orange-100/70 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
