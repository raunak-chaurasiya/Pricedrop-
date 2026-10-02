import Image from "next/image";
import AuthButton from "@/components/ui/AuthButton";
import Dashboard from "@/components/ui/Dashboard";
import { createClient } from "@/utils/supabase/server";

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
          <div className="flex items-center gap-2">
            <Image
              src="/deal-drop-logo.png"
              alt="PriceDrop Logo"
              width={160}
              height={45}
              className="w-auto h-9 object-contain"
              priority
            />
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <Dashboard initialUser={user} initialProducts={products} />
      </section>

      {/* Professional Footer */}
      <footer className="mt-auto border-t border-gray-200/60 bg-white/60 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-gray-600">
            © {new Date().getFullYear()} PriceDrop • Smart Price Tracker for Amazon, Flipkart & Top Stores
          </p>
          <p className="text-gray-400">
            Real-Time Price Monitoring & Instant Price Drop Alerts
          </p>
        </div>
      </footer>
    </main>
  );
}
