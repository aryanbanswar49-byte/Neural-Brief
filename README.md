# SignalAI — High-Clarity Design & Technology Platform

**SignalAI** is a production-grade, editorial blogging platform and content management system (CMS) built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and powered by **Supabase** (Authentication, PostgreSQL Database with Row Level Security, and Storage).

---

## 🌟 Key Features

### 📖 Public Editorial Experience
* **Curated Homepage:** Hero featured story, latest articles grid, reading time indicators, category post counters, and newsletter subscription.
* **Category Archives (`/category/:slug`):** Filter articles by topic with dynamic descriptions and counts.
* **Article View (`/blog/:slug`):** Clean typography layout with reading progress bar, author profile info, and related articles.
* **Full-Text Search (`/search`):** Real-time search across titles, excerpts, content, and categories with no-results recommendations.
* **Inquiry Desk (`/contact`):** Direct contact form connected to PostgreSQL database with office hours info.
* **Dark / Light Mode:** Persistent theme switcher with smooth transitions across all views.

### 🔐 Secure Supabase Authentication & CMS
* **Supabase Auth:** Email and password authentication with persistent sessions and password reset flow.
* **Role-Based Authorization:** Server-enforced roles (`admin`, `author`, `reader`) via PostgreSQL `profiles` table.
* **Admin Dashboard (`/admin/dashboard`):** Real-time aggregated statistics (Total, Published, Drafts, Categories) and recent articles.
* **Article Management (`/admin/posts`):**
  * Create, edit, and delete articles with custom confirmation modals.
  * Save as private Draft or Publish for public indexing.
  * Image upload directly to Supabase Storage (`blog-images` bucket).
  * SEO Meta Title and Meta Description customization.
* **Category Management (`/admin/categories`):** Create, update, and delete categories with auto-slug generation.

### 🚀 SEO & Content Safety
* **Dynamic Head Metadata (`react-helmet-async`):** Unique `<title>`, meta description, canonical URLs, Open Graph tags, and Twitter/X cards.
* **Structured Data:** Schema.org JSON-LD for `BlogPosting` and `WebSite`.
* **Search Engine Control:** `public/robots.txt` and `public/sitemap.xml` with automatic `noindex` for draft posts.
* **XSS Protection:** Typographic Markdown content renderer without arbitrary unescaped HTML injection.

---

## 🌿 Git Branches & Architecture

This repository is organized into dedicated feature branches:

| Branch | Description | Key Modules |
|---|---|---|
| **`main`** | **Production Release:** Complete integrated application with Supabase backend, CMS, SEO, and SignalAI branding. | Entire platform |
| **`feature/supabase-backend`** | **Data & Auth Layer:** Supabase client, AuthContext, PostgreSQL schema, RLS policies, seed data, and API service. | `src/lib/supabase.ts`, `src/services/api.ts`, `src/context/AuthContext.tsx`, `supabase/` |
| **`feature/admin-cms`** | **CMS & Management:** Admin dashboard, post authoring, category management, Supabase storage image uploader. | `src/pages/admin/`, `src/components/AdminLayout.tsx` |
| **`feature/seo-and-accessibility`** | **SEO & Discoverability:** Dynamic Helmet metadata, Schema.org JSON-LD, sitemap, robots.txt, safe typography parser. | `src/components/SEO.tsx`, `src/components/SafeContent.tsx`, `public/` |
| **`feature/branding-signal-ai`** | **Branding & Visuals:** SignalAI design system, Plus Jakarta Sans & Source Serif 4 typography, dark mode styling. | `src/components/PublicLayout.tsx`, `src/pages/public/`, `tailwind.config.js` |

---

## 🛠️ Tech Stack

* **Framework:** React 18 + Vite 5 + TypeScript 5
* **Styling:** Tailwind CSS + PostCSS
* **Icons:** Lucide React
* **Backend:** Supabase (Auth, PostgreSQL Database, Storage)
* **SEO:** React Helmet Async + Schema.org JSON-LD
* **Routing:** React Router DOM v6

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR-USERNAME/signal-ai.git
cd signal-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```ini
VITE_SUPABASE_URL=https://ttjcfgsxwyadwoqkypbr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_rq7W8oY21-4pJkqnqTLkZQ_tP3LQX9T
VITE_SITE_URL=https://theeditorial.com
```

### 3. Initialize Supabase Database
1. Go to your **[Supabase SQL Editor](https://supabase.com/dashboard/project/ttjcfgsxwyadwoqkypbr/sql)**.
2. Run `supabase/schema.sql` (Creates tables, triggers, storage bucket, and RLS policies).
3. Run `supabase/seed.sql` (Populates initial categories and sample articles).
4. Create an admin user under **Authentication > Users** and verify `role = 'admin'` in the `profiles` table.

### 4. Run Locally
```bash
# Start local development server
npm run dev

# Or build and run production preview
npm run build
npm run preview
```

---

## 📦 Deployment

### Deploy to Vercel / Netlify / Cloudflare Pages
1. Connect your GitHub repository.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variables:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_PUBLISHABLE_KEY`
   * `VITE_SITE_URL`
5. Deploy!

---

## 📄 License
MIT &copy; SignalAI. All rights reserved.
