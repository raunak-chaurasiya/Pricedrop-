<div align="center">

# 📉 PriceDrop - Smart Price History Tracker & Deal Intelligence

**Never overpay again. Track real-time prices from Amazon, Flipkart & top stores with AI-powered "Buy or Wait" verdicts, multi-timeframe history charts, product specifications, alternative deals, and 1-click social share cards.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-pricedrop--sable.vercel.app-ff6b00?style=for-the-badge)](https://pricedrop-sable.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Firecrawl](https://img.shields.io/badge/Firecrawl_v2-FF4F00?style=for-the-badge&logo=firecrawl&logoColor=white)](https://firecrawl.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://pricedrop-sable.vercel.app/)

<br />

[Explore Live App ↗](https://pricedrop-sable.vercel.app/) • [Report Bug ↗](https://github.com/raunak-chaurasiya/Pricedrop-/issues) • [Request Feature ↗](https://github.com/raunak-chaurasiya/Pricedrop-/issues)

</div>

---

## 🌟 Overview

**PriceDrop** is an automated price monitoring and deal intelligence web application engineered to give shoppers complete transparency into e-commerce price movements. Simply paste any product link from popular stores (Amazon, Flipkart, Myntra, etc.), and PriceDrop extracts product data, analyzes price history, computes an AI Deal Score, and advises whether it's a great time to buy or wait for the next sale.

---

## ✨ Flagship Features

### 1. 🤖 AI "Buy or Wait?" Smart Verdict & Deal Score
- **Algorithmic Deal Score (0 to 100)**: Calculates exact market price position relative to all-time low and all-time high records.
- **Smart Verdict Badges**:
  - 🟢 **Buy Now (Score: 85–100)**: Current price is at or within 5% of its all-time record low.
  - 🟡 **Fair Price (Score: 55–84)**: Price is in a reasonable mid-bracket.
  - 🔴 **Wait & Watch (Score: 0–54)**: Product is near its peak price; discount expected soon.
- **Natural Language Insights**: Shows actual rupee calculations (e.g., *"₹7,000 below peak, but has historically reached ₹92,000 during sales"*).

### 2. 📊 Interactive Multi-Timeframe Price History Chart
- **Timeframe Filters**: Switch dynamically between **1M**, **3M**, **6M**, and **MAX** history views.
- **Stats Cards**: Live display of Current Price, All-Time Lowest, and All-Time Highest.
- **Trend Detection**: Instant calculation of rupee drops or increases with animated trend banners.
- Built with **Recharts AreaChart** with responsive gradients and custom tooltips.

### 3. 🖼️ Multi-Photo Product Gallery
- Automatically extracts multiple high-resolution photos and angle shots from the product page.
- Interactive image viewer with thumbnail selector, image counter, and next/previous controls.

### 4. 📋 Key Specifications & Highlights
- Automated AI extraction of technical bullet points, features, and product specifications.
- Clean presentation with icon checkmarks and formatted cards.

### 5. ⚖️ Similar & Alternative Products Engine
- Same-page scraping of competitor and alternative products from *"Similar products"* and *"Customers also viewed"* sections without extra API overhead.
- Live price comparison badges (e.g., 🟢 `₹1,200 Cheaper` or `₹800 Higher`).
- **1-Click "+ Track" Button**: Instantly adds the alternative product to your own dashboard with a single click.

### 6. 📸 1-Click "Deal Card" Share (WhatsApp & PNG Download)
- **Visual Story Card (4:5 Ratio)**: Optimized for Instagram Stories, WhatsApp Status, and Twitter.
- **WhatsApp Direct Share**: 1-click sharing with pre-formatted bold headings, price breakdown, and store link.
- **Client-Side PNG Download**: HTML5 Canvas engine dynamically renders a high-resolution dark-mode deal card directly in the browser with zero server latency.
- **Native Share Sheet**: Triggers native iOS / Android share sheet on mobile devices.

### 7. 🔔 Background Automated Price Refresh
- Background Cron endpoint (`/api/cron/track`) designed for automated Vercel Cron executions.
- Records chronological price history points and updates lowest/highest price baselines.

### 8. 📱 100% Mobile Responsive & Modern Aesthetics
- Built with Tailwind CSS v4 and fluid typography.
- Optimized for all screen sizes from 320px mobile devices to 4K ultra-wide monitors.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `@base-ui/react` |
| **Charts & Data Viz** | [Recharts](https://recharts.org/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL & SSR Auth) |
| **Web Scraping** | [Firecrawl JS SDK](https://firecrawl.dev/) (v2 AI Scrape) |
| **Notifications** | [Sonner Toast](https://sonner.emilkowal.ski/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) |

---

## 🗄️ Database Schema (Supabase PostgreSQL)

```sql
-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  similar_products JSONB DEFAULT '[]'::jsonb,
  current_price NUMERIC NOT NULL,
  currency TEXT DEFAULT '₹',
  lowest_price NUMERIC,
  highest_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Price History Table
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Indexes for Speed
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_created_at ON public.price_history(created_at ASC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
```

---

## ⚙️ Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- [Git](https://git-scm.com/)
- [Supabase](https://supabase.com/) account (free tier)
- [Firecrawl](https://firecrawl.dev/) API Key (free tier)

### 2. Clone the Repository
```bash
git clone https://github.com/raunak-chaurasiya/Pricedrop-.git
cd Pricedrop-
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firecrawl API Key (https://firecrawl.dev)
FIRECRAWL_API_KEY=fc-your-api-key

# Cron Job Secret (Optional)
CRON_SECRET=your-secure-random-secret
```

### 5. Run the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
pricdrop/
├── app/
│   ├── api/
│   │   ├── cron/track/route.js    # Background price refresh cron job
│   │   ├── products/
│   │   │   ├── route.js          # GET all products / POST new product
│   │   │   └── [id]/route.js     # DELETE / POST refresh single product
│   ├── layout.js                 # Root layout with fonts & toaster
│   ├── page.jsx                  # Main home page
│   └── globals.css               # Tailwind CSS v4 design tokens
├── components/
│   └── ui/
│       ├── AddproductForm.jsx    # URL input & extraction submit form
│       ├── Dashboard.jsx         # Tracked products grid & empty states
│       ├── ProductCard.jsx       # Card with AI badge, quick actions & image
│       ├── PriceHistoryChart.jsx # 4-tab history modal (Trend, Images, Specs, Similar)
│       └── ShareDealModal.jsx    # WhatsApp share & HTML5 Canvas PNG card generator
├── lib/
│   ├── dealAnalysis.js           # Algorithmic AI deal score & recommendation engine
│   ├── firecrawl.js              # Firecrawl v2 schema & web scraper
│   └── utils.js                  # Tailwind class merging utility
├── schema.sql                    # Full PostgreSQL database schema & RLS policies
└── vercel.json                   # Deployment & cron job configurations
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!  
Feel free to open an issue or submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/raunak-chaurasiya">Raunak Chaurasiya</a></sub>
</div>