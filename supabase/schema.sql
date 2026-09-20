-- ==============================================================================
-- ST CLOTHING — DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    role text not null default 'customer' check (role in ('admin', 'customer')),
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for profiles
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

-- Helper function to check if current user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Trigger to automatically create a profile when a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image_url text,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_categories_slug on public.categories(slug);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS
-- ------------------------------------------------------------------------------
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    compare_at_price numeric(10, 2) check (compare_at_price >= 0),
    category_id uuid references public.categories(id) on delete set null,
    featured boolean default false,
    published boolean default true,
    new_arrival boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_published on public.products(published);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_products_new_arrival on public.products(new_arrival);

-- ------------------------------------------------------------------------------
-- 4. PRODUCT IMAGES
-- ------------------------------------------------------------------------------
create table if not exists public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    image_url text not null,
    storage_path text,
    alt_text text,
    sort_order integer default 0,
    is_primary boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_images_sort on public.product_images(product_id, sort_order);

-- ------------------------------------------------------------------------------
-- 5. PRODUCT VARIANTS (SIZES, COLORS, STOCK)
-- ------------------------------------------------------------------------------
create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    size text not null,
    color text not null,
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    sku text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(product_id, size, color)
);

create index if not exists idx_product_variants_product_id on public.product_variants(product_id);

-- ------------------------------------------------------------------------------
-- 6. ORDERS
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    delivery_address text not null,
    city text,
    postal_code text,
    country text default 'United States',
    total_amount numeric(10, 2) not null check (total_amount >= 0),
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- ------------------------------------------------------------------------------
-- 7. ORDER ITEMS
-- ------------------------------------------------------------------------------
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    quantity integer not null default 1 check (quantity > 0),
    price numeric(10, 2) not null check (price >= 0),
    size text,
    color text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- PROFILES POLICIES
create policy "Users can view their own profile or admin can view all"
    on public.profiles for select
    using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id or public.is_admin());

-- CATEGORIES POLICIES
create policy "Anyone can view categories"
    on public.categories for select
    using (true);

create policy "Admins can insert categories"
    on public.categories for insert
    with check (public.is_admin());

create policy "Admins can update categories"
    on public.categories for update
    using (public.is_admin());

create policy "Admins can delete categories"
    on public.categories for delete
    using (public.is_admin());

-- PRODUCTS POLICIES
create policy "Public can view published products, admins view all"
    on public.products for select
    using (published = true or public.is_admin());

create policy "Admins can insert products"
    on public.products for insert
    with check (public.is_admin());

create policy "Admins can update products"
    on public.products for update
    using (public.is_admin());

create policy "Admins can delete products"
    on public.products for delete
    using (public.is_admin());

-- PRODUCT IMAGES POLICIES
create policy "Public can view product images of visible products"
    on public.product_images for select
    using (
        exists (
            select 1 from public.products
            where products.id = product_images.product_id
            and (products.published = true or public.is_admin())
        )
    );

create policy "Admins can insert product images"
    on public.product_images for insert
    with check (public.is_admin());

create policy "Admins can update product images"
    on public.product_images for update
    using (public.is_admin());

create policy "Admins can delete product images"
    on public.product_images for delete
    using (public.is_admin());

-- PRODUCT VARIANTS POLICIES
create policy "Public can view variants of visible products"
    on public.product_variants for select
    using (
        exists (
            select 1 from public.products
            where products.id = product_variants.product_id
            and (products.published = true or public.is_admin())
        )
    );

create policy "Admins can insert product variants"
    on public.product_variants for insert
    with check (public.is_admin());

create policy "Admins can update product variants"
    on public.product_variants for update
    using (public.is_admin());

create policy "Admins can delete product variants"
    on public.product_variants for delete
    using (public.is_admin());

-- ORDERS POLICIES
create policy "Public can create orders"
    on public.orders for insert
    with check (true);

create policy "Admins can view orders"
    on public.orders for select
    using (public.is_admin());

create policy "Admins can update orders"
    on public.orders for update
    using (public.is_admin());

-- ORDER ITEMS POLICIES
create policy "Public can insert order items"
    on public.order_items for insert
    with check (true);

create policy "Admins can view order items"
    on public.order_items for select
    using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
-- Insert bucket if not exists
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies
create policy "Public can view product-images"
    on storage.objects for select
    using (bucket_id = 'product-images');

create policy "Admins can upload to product-images"
    on storage.objects for insert
    with check (bucket_id = 'product-images' and (auth.role() = 'authenticated' or public.is_admin()));

create policy "Admins can update objects in product-images"
    on storage.objects for update
    using (bucket_id = 'product-images' and (auth.role() = 'authenticated' or public.is_admin()));

create policy "Admins can delete objects in product-images"
    on storage.objects for delete
    using (bucket_id = 'product-images' and (auth.role() = 'authenticated' or public.is_admin()));

-- ------------------------------------------------------------------------------
-- 10. STORE SETTINGS & FRONT-END ORDER/BAG CONTROLS
-- ------------------------------------------------------------------------------
create table if not exists public.store_settings (
    id text primary key default 'default',
    
    -- Feature Toggles & Controls
    orders_enabled boolean not null default true,
    bag_enabled boolean not null default true,
    ordering_disabled_notice text default 'Online orders are temporarily paused for drop preparation. Showcase browsing active.',
    
    -- Brand Identity & Styling
    store_name text not null default 'ST CLOTHING',
    tagline text default 'Made for Tema. Worn Everywhere.',
    description text default 'Contemporary minimalist silhouettes engineered in Tema, Ghana. We balance heavyweight organic cottons, tailored drapes, and quiet Ghanaian craftsmanship.',
    accent_color text not null default '#B5532F',
    currency_symbol text not null default 'GH₵',
    
    -- Contact & Direct Communication
    primary_phone text not null default '0544911015',
    primary_phone_display text not null default '054 491 1015',
    primary_whatsapp text not null default '233544911015',
    secondary_phone text default '0209300106',
    secondary_phone_display text default '020 930 0106',
    secondary_whatsapp text default '233209300106',
    email text default 'contact@stclothinggh.com',
    
    -- Location & Working Hours
    city text not null default 'Tema',
    region text not null default 'Greater Accra',
    country text not null default 'Ghana',
    full_address text not null default 'Community 1, Tema, Greater Accra, Ghana',
    map_query text default 'Tema, Greater Accra, Ghana',
    business_hours text default 'Mon - Sat: 9:00 AM - 7:00 PM GMT',
    business_hours_sunday text default 'Sunday: Studio by Appointment',
    
    -- Social Media Channels
    instagram_handle text default '@st_clothing_gh',
    instagram_url text default 'https://instagram.com/st_clothing_gh',
    facebook_url text default 'https://facebook.com/stclothinggh',
    tiktok_url text default 'https://tiktok.com/@st_clothing_gh',
    
    -- Delivery & Payment Notes
    delivery_info text default 'Same-day or next-day courier delivery available in Tema, Accra, Spintex, and East Legon. Nationwide shipping in 2–3 business days.',
    payment_methods text default 'MTN Mobile Money, Telecel Cash, and Pay on Delivery within Greater Accra.',
    
    -- Flexible JSONB
    settings jsonb default '{}'::jsonb,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments
comment on table public.store_settings is 'Stores global storefront configuration, order/bag feature toggles, and brand metadata';

-- Trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at
  before update on public.store_settings
  for each row execute function public.handle_updated_at();

-- RLS Policies
alter table public.store_settings enable row level security;

create policy "Public can view store settings"
    on public.store_settings for select
    using (true);

create policy "Admins can insert store settings"
    on public.store_settings for insert
    with check (public.is_admin() or auth.role() = 'service_role');

create policy "Admins can update store settings"
    on public.store_settings for update
    using (public.is_admin() or auth.role() = 'service_role');

-- Seed Default Row
insert into public.store_settings (
    id,
    orders_enabled,
    bag_enabled,
    ordering_disabled_notice,
    store_name,
    tagline,
    description,
    accent_color,
    currency_symbol,
    primary_phone,
    primary_phone_display,
    primary_whatsapp,
    secondary_phone,
    secondary_phone_display,
    secondary_whatsapp,
    email,
    city,
    region,
    country,
    full_address,
    map_query,
    business_hours,
    business_hours_sunday,
    instagram_handle,
    instagram_url,
    facebook_url,
    tiktok_url,
    delivery_info,
    payment_methods,
    settings
) values (
    'default',
    true,
    true,
    'Online orders are temporarily paused for drop preparation. Showcase browsing active.',
    'ST CLOTHING',
    'Made for Tema. Worn Everywhere.',
    'Contemporary minimalist silhouettes engineered in Tema, Ghana. We balance heavyweight organic cottons, tailored drapes, and quiet Ghanaian craftsmanship.',
    '#B5532F',
    'GH₵',
    '0544911015',
    '054 491 1015',
    '233544911015',
    '0209300106',
    '020 930 0106',
    '233209300106',
    'contact@stclothinggh.com',
    'Tema',
    'Greater Accra',
    'Ghana',
    'Community 1, Tema, Greater Accra, Ghana',
    'Tema, Greater Accra, Ghana',
    'Mon - Sat: 9:00 AM - 7:00 PM GMT',
    'Sunday: Studio by Appointment',
    '@st_clothing_gh',
    'https://instagram.com/st_clothing_gh',
    'https://facebook.com/stclothinggh',
    'https://tiktok.com/@st_clothing_gh',
    'Same-day or next-day courier delivery available in Tema, Accra, Spintex, and East Legon. Nationwide shipping in 2–3 business days.',
    'MTN Mobile Money, Telecel Cash, and Pay on Delivery within Greater Accra.',
    '{}'::jsonb
)
on conflict (id) do nothing;
