import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/components/ui/AuthButton";
import Dashboard from "@/components/ui/Dashboard";
import FaqSection from "@/components/ui/FaqSection";
import { createClient } from "@/utils/supabase/server";
import { Mail } from "lucide-react";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let products = [];
  if (user) {
    const { data } = await supabase
      .from("products")
      .select(`
        *,
        price_history (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    products = data || [];
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50/40">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <Image
                src="/deal-drop-logo.png"
                alt="PriceDrop Logo"
                width={160}
                height={45}
                className="w-auto h-9 object-contain"
                priority
              />
            </Link>

            <nav className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
              <Link
                href="/"
                className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg"
              >
                Tracker
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <Dashboard
          key={user?.id || "guest"}
          initialUser={user}
          initialProducts={products}
        />
      </section>

      {/* FAQ Section */}
      <FaqSection />

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
              href="/about"
              className="text-xs font-semibold text-gray-600 hover:text-orange-600 transition-colors"
            >
              About DealDrop
            </Link>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 bg-orange-50/80 border border-orange-200/70 px-3.5 py-1.5 rounded-full text-xs text-gray-600 shadow-2xs">
              <span className="text-gray-500 font-normal">Questions or feedback?</span>
              <a
                href="mailto:dealdrop58@gmail.com?subject=PriceDrop%20Support%20%26%20Query"
                className="inline-flex items-center gap-1.5 font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>dealdrop58@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
