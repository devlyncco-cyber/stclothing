# ST CLOTHING — FULL-STACK FASHION SHOWCASE & ADMIN PLATFORM

A production-ready full-stack e-commerce showcase and content management platform for **ST Clothing**, a modern minimalist luxury fashion brand.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Storage, Auth, Row Level Security)**.

---

## Features

### 1. Public Storefront
* **Minimalist Homepage (`/`)**: Editorial lookbook hero with tagline *"Designed for those who define their own style"*, featured collection grid, brand philosophy statement, new arrivals spotlight, and value propositions.
* **Catalog & Collection (`/shop`)**: Dynamic responsive grid (4 cols desktop, 2-3 cols tablet, 2 cols mobile), live category filters, multi-criteria sorting (Newest, Price: Low to High, Price: High to Low), and keyword search.
* **Product Details (`/product/[slug]`)**: Multi-angle image gallery with thumbnail viewer and mobile swipe, size & color variant selector, dynamic real-time stock indicator, quantity selector, add to bag feedback, and "You may also like" recommendations.
* **Shopping Bag (`/cart` & Cart Drawer)**: Slide-out interactive bag with quantity controls, subtotal computation, persistent storage, and direct checkout trigger.
* **Checkout (`/checkout`)**: Shipping destination form, order breakdown, and instant order creation into Supabase database.
* **Brand Stories (`/about`, `/contact`, `/privacy`, `/terms`)**: Editorial craftsmanship statement and studio inquiry concierge.

### 2. Secure Admin Platform
* **Admin Authentication (`/admin/login`)**: Protected route using Supabase Auth with role-based access control (`profiles.role = 'admin'`).
* **Executive Dashboard (`/admin`)**: Real-time KPI statistics cards (Total Products, Published, Drafts, Out of Stock, Total Revenue), quick management shortcuts, and recent orders overview.
* **Product Inventory (`/admin/products`)**: Data table with thumbnail previews, live publication toggles, featured badges, search, category filter, and deletion confirmation safety modals.
* **Add & Edit Garments (`/admin/products/new`, `/admin/products/[id]/edit`)**: Multi-image uploader connected directly to Supabase Storage (`product-images`), image reordering, primary photo designation, variant matrix manager (sizes, colors, inventory stock), and real-time database syncing.
* **Orders Management (`/admin/orders`)**: Complete order history, customer address breakdown, line items detail view, and instant order status transition controls (`pending` → `confirmed` → `processing` → `shipped` → `delivered` → `cancelled`).
* **Category Management (`/admin/categories`)**: Dynamic category creation with automatic slug generation.

---

## Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS (Curated Monochromatic Palette)
* **Database & Auth**: Supabase PostgreSQL + Supabase Auth
* **File Storage**: Supabase Storage (`product-images` bucket)
* **Security**: Supabase Row Level Security (RLS) & Triggers
* **Icons**: Lucide React

---

## Supabase Setup Guide

Follow these steps to connect your live Supabase project:

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Set your Project Name (e.g. `st-clothing`) and secure database password.
3. Select your preferred region and create the project.

### Step 2: Run Database Migrations
1. In your Supabase project dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and paste it into the editor.
4. Click **Run** to create all tables (`profiles`, `categories`, `products`, `product_images`, `product_variants`, `orders`, `order_items`), indexes, RLS policies, and triggers.

### Step 3: Insert Initial Seed Dataset (Optional but Recommended)
1. In the **SQL Editor**, open another **New Query**.
2. Copy the entire contents of [`supabase/seed.sql`](./supabase/seed.sql) and paste it into the editor.
3. Click **Run** to populate initial categories, products, images, and inventory variants.

### Step 4: Configure Storage Bucket
1. Go to the **Storage** tab in your Supabase dashboard.
2. Verify that the bucket named `product-images` exists and is set to **Public**. (The SQL schema script automatically creates and configures this policy).
3. If creating manually: click **New Bucket** -> Name: `product-images` -> Enable **Public bucket** -> Save.

### Step 5: Create Your First Admin User
1. In your Supabase dashboard, go to **Authentication** -> **Users** -> Click **Add User** -> **Create User**.
2. Enter an email (e.g. `admin@stclothing.com`) and a password.
3. After creating the user, go to the **SQL Editor** and run this query to grant admin privileges:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@stclothing.com';
```

---

## Environment Configuration

Create a `.env.local` file in the project root based on `.env.example`:

```env
# Supabase Public Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (Server-side privileged operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: If environment variables are omitted or blank, the application automatically runs in **Offline/Demo Preview Mode** using a built-in reactive store so you can explore the storefront and admin dashboard immediately with zero configuration!

---

## Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser:
   * **Storefront**: `http://localhost:3000`
   * **Catalog**: `http://localhost:3000/shop`
   * **Admin Console**: `http://localhost:3000/admin`
   * **Admin Login**: `http://localhost:3000/admin/login` (Demo credentials: `admin@stclothing.com` / `admin123`)

---

## Deploying to Vercel

1. Push your repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
3. Import your ST Clothing repository.
4. In the **Environment Variables** section, add:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**. Vercel will automatically build and deploy your application worldwide.

---

## Production Verification Checklist

- [x] Monochromatic minimalist fashion aesthetic matching brand identity
- [x] Dynamic shop with multi-column responsive grid and live category & sort filters
- [x] Product detail pages with multi-angle gallery, size & color matrix, and stock calculation
- [x] Shopping bag context with persistent localStorage and slide-over drawer
- [x] Order checkout capturing customer info and creating records in PostgreSQL
- [x] Admin authentication and role verification (`profiles.role = 'admin'`)
- [x] Admin dashboard with executive KPI counters and order stream
- [x] Product creation and editing with Supabase Storage multi-image upload
- [x] Product deletion with confirmation safety modal and storage cleanup
- [x] Dynamic category management
- [x] Order fulfillment status transition management
- [x] Complete SQL schema, seed dataset, and RLS policies
