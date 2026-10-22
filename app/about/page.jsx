import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingDown,
  ShieldCheck,
  Sparkles,
  LineChart,
  ShoppingBag,
  Layers,
  ArrowRight,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import AuthButton from "@/components/ui/AuthButton";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "About DealDrop — Why We Built an Honest Price Tracker",
  description:
    "Learn why DealDrop was built: to fight deceptive discounts, track genuine price drops across Amazon & Flipkart, and help Indian online shoppers make smart, data-driven decisions.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50/60 via-white to-amber-50/40 flex flex-col">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <Image
                src="/deal-drop-logo.png"
                alt="DealDrop Logo"
                width={160}
                height={45}
                className="w-auto h-9 object-contain"
                priority
              />
            </Link>

            <nav className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
              <Link
                href="/"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Tracker
              </Link>
              <Link
                href="/about"
                className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg"
              >
                About
              </Link>
            </nav>
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100/80 text-orange-700 border border-orange-200/60 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Honest Price Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight sm:leading-tight mb-6">
          Online discounts aren&apos;t always honest.{" "}
          <span className="text-orange-600">DealDrop</span> was built to fix that.
        </h1>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          Every day, millions of online shoppers get misled by artificial markups and deceptive festive discounts. We built DealDrop to bring complete, unfiltered transparency to online prices in India.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>Start Tracking Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#story"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm border border-gray-200 shadow-xs transition-colors"
          >
            Read Our Story
          </a>
        </div>
      </section>

      {/* The Honest Problem Story Section */}
      <section id="story" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 tracking-wider uppercase mb-3">
            <AlertCircle className="w-4 h-4" /> The Problem We Solve
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
            The Illusion of &quot;70% OFF&quot; Sales
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            <p>
              Ever noticed a pair of headphones priced at ₹1,999 during a major festive sale, proudly sporting a <em>&quot;70% OFF Limited Deal&quot;</em> badge — only to realize it was selling for ₹1,499 just two weeks earlier on a regular Tuesday?
            </p>
            <p>
              In modern e-commerce, prices fluctuate dozens of times every week. Sellers often inflate the baseline MRP right before big shopping festivals like the Great Indian Festival and Big Billion Days. The result? Shoppers end up believing they got a massive discount when in fact they paid full or above-average price.
            </p>
            <p className="font-semibold text-gray-900">
              DealDrop exists for one clear purpose: to arm you with historical price facts so you always buy at the true lowest price.
            </p>
          </div>

          {/* Visual Comparison Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="bg-rose-50/70 border border-rose-200/70 rounded-2xl p-5 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-1">
                The Marketing Gimmick
              </span>
              <p className="font-bold text-gray-900 text-base mb-1">
                Artificial Price Inflations
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Prices get raised right before discount banners go live, making ordinary prices look like once-in-a-lifetime deals.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-5 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                The DealDrop Way
              </span>
              <p className="font-bold text-gray-900 text-base mb-1">
                Unfiltered Historical Truth
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Full timeline of genuine past prices, AI deal verdicts, and all-time lowest records to verify every single deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How DealDrop Works / Core Features */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            How DealDrop Helps
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
            What We Do — Without the Gimmick
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2">
            No browser extensions to install, no spam emails, and no paid memberships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-orange-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              Interactive Price Fluctuations
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every time a product is refreshed, DealDrop logs the exact timestamp and price. You can view 1 Month, 3 Months, 6 Months, or all-time trends on clear, easy-to-read charts.
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-orange-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              AI Deal Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Instead of leaving you to decipher raw numbers, our algorithm checks the current price against historical peaks and valleys to tell you: <em>Buy Now</em>, <em>Fair Price</em>, or <em>Wait for Drop</em>.
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-orange-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              Similar Products & Alternative Finds
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If an item is overpriced or out of stock, DealDrop automatically scans for relevant alternatives and compatible protection plans so you don&apos;t miss better options.
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:border-orange-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              Zero Friction & Simple To Use
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              No bloated extensions tracking your private web browsing. Just copy any product URL from Amazon, Flipkart, or top stores, paste it into DealDrop, and start tracking in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-linear-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 border border-orange-800/60 px-3 py-1 rounded-full">
            Our Commitments
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3 mb-6">
            Built on Transparency, Not Hidden Agendas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 font-bold text-base mb-2 text-orange-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free Forever</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                DealDrop is completely free for individual shoppers. We believe price transparency is a basic right, not a paid service.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-bold text-base mb-2 text-orange-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Data Selling</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                We do not sell your tracking habits or personal shopping activity to third-party ad networks or brokers.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-bold text-base mb-2 text-orange-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unbiased Insights</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                We don&apos;t accept payment from brands to artificially inflate their deal scores. What you see is genuine store data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Creator Section */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            Behind DealDrop
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 mb-6">
            Meet the Creator
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar / Initials */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-tr from-orange-500 to-amber-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-md">
              RC
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Raunak Chaurasiya
                </h3>
                <p className="text-xs text-orange-600 font-semibold">
                  Software Developer & Creator of DealDrop
                </p>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                &ldquo;Like most people, I do a lot of my everyday shopping online. After repeatedly getting burned by dynamic pricing and fake festive &lsquo;deals&rsquo;, I decided to build a simple, reliable tool to monitor products I actually intended to buy.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                What began as a personal weekend project evolved into DealDrop — an honest, fast, and transparent deal intelligence platform built for Indian shoppers. I actively maintain and improve the platform based on feedback from real users.&rdquo;
              </p>

              {/* Creator Social / Action Links */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="https://www.linkedin.com/in/raunakchaurasiya/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a
                  href="mailto:dealdrop58@gmail.com?subject=DealDrop%20Inquiry%20from%20About%20Page"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span>dealdrop58@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-4xl font-black mb-3">
            Stop Guessing. Start Tracking Real Drops.
          </h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Paste any Amazon or Flipkart product link right now and discover whether you&apos;re actually getting a fair deal.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-orange-700 font-black text-sm shadow-md hover:bg-orange-50 transition-all hover:scale-102"
          >
            <span>Track a Product Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="mt-auto border-t border-gray-200/60 bg-white/70 backdrop-blur-xs py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <p className="font-semibold text-gray-700">
              © {new Date().getFullYear()} DealDrop • Smart Price Tracker
            </p>
            <p className="text-gray-400">
              Real-Time Price Monitoring & Instant Price Drop Alerts for Amazon, Flipkart & Top Stores
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              Price Tracker
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/about"
              className="text-orange-600 font-semibold"
            >
              About DealDrop
            </Link>
            <span className="text-gray-300">•</span>
            <a
              href="mailto:dealdrop58@gmail.com?subject=PriceDrop%20Support%20%26%20Query"
              className="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>dealdrop58@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
