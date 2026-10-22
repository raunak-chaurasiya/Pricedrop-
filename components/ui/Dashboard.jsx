"use client";

import React, { useState, useEffect } from "react";
import AddproductForm from "@/components/ui/AddproductForm";
import ProductCard from "@/components/ui/ProductCard";
import { Rabbit, Shield, Bell, PackageOpen, Sparkles, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/ui/AuthModal";
import { DEMO_PRODUCTS } from "@/lib/demoProducts";

export default function Dashboard({ initialUser, initialProducts = [] }) {
  const [user, setUser] = useState(initialUser);
  const [products, setProducts] = useState(initialProducts);
  const [selectedDemoFilter, setSelectedDemoFilter] = useState("all");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDemosForUser, setShowDemosForUser] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProducts([]);
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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

  const handleSelectDemo = (demo) => {
    setSelectedDemoFilter(demo.id);
  };

  const displayedDemos =
    selectedDemoFilter === "all"
      ? DEMO_PRODUCTS
      : DEMO_PRODUCTS.filter((d) => d.id === selectedDemoFilter);

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

        {/* Input Form with 1-Click Demo Pills */}
        <AddproductForm
          user={user}
          onProductAdded={handleProductAdded}
          onSelectDemo={handleSelectDemo}
        />
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto mt-16">
        {/* Case 1: Logged-in user with products */}
        {user && products.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Tracked Products</h2>
                <p className="text-sm text-gray-500">
                  {products.length} product{products.length === 1 ? "" : "s"} currently being tracked
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemosForUser((prev) => !prev)}
                className="text-xs font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showDemosForUser ? "Hide Demo Products" : "Explore Demo Products"}</span>
              </Button>
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
        )}

        {/* Case 2: Logged-in user with NO products */}
        {user && products.length === 0 && (
          <div className="text-center py-10 bg-white/70 border border-dashed border-gray-300 rounded-2xl mb-12">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No tracked products yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              Paste a product link from Amazon or Flipkart above, or test our live demo below!
            </p>
          </div>
        )}

        {/* Live Interactive Demo Showcase (Shown for guests OR when toggled by user) */}
        {(!user || user.length === 0 || showDemosForUser || products.length === 0) && (
          <div id="demo-preview-section" className="mb-16 scroll-mt-24">
            {/* Demo Header Bar */}
            <div className="bg-white/90 backdrop-blur-xs border border-orange-200/80 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-600 text-white shadow-2xs">
                    <Sparkles className="w-3 h-3" /> Live Demo Mode
                  </span>
                  <span className="text-xs text-gray-400 font-medium hidden sm:inline">•</span>
                  <span className="text-xs font-semibold text-emerald-700 hidden sm:inline">
                    No login required to test
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  Experience DealDrop in Action
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Click <strong>&quot;History&quot;</strong> on any card to see real interactive price trend charts, AI deal intelligence, and spec highlights.
                </p>
              </div>

              {/* Demo Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/90 p-1 rounded-xl text-xs font-semibold self-start md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedDemoFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedDemoFilter === "all"
                      ? "bg-white text-orange-600 shadow-xs font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All Demos ({DEMO_PRODUCTS.length})
                </button>
                {DEMO_PRODUCTS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDemoFilter(d.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedDemoFilter === d.id
                        ? "bg-white text-orange-600 shadow-xs font-bold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {d.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Demo Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedDemos.map((demoProduct) => (
                <div key={demoProduct.id} className="relative transition-all duration-300">
                  <ProductCard
                    product={demoProduct}
                    isDemo={true}
                    onProductUpdated={() => {}}
                    onProductDeleted={() => {}}
                  />
                </div>
              ))}
            </div>

            {/* Guest Sign-in Callout Banner */}
            {!user && (
              <div className="mt-8 bg-linear-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg text-center sm:text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Free Forever for Shoppers</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    Loved the interactive preview? Track your own items!
                  </h3>
                  <p className="text-orange-100 text-xs sm:text-sm max-w-xl">
                    Sign in with Google or Email in seconds to save your favorite Amazon & Flipkart products with continuous price monitoring.
                  </p>
                </div>

                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-7 py-3 text-sm rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 hover:scale-102"
                >
                  <span>Sign In & Start Tracking</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Features Showcase */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:border-orange-200 transition-all text-left"
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

