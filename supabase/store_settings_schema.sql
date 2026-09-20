-- ==============================================================================
-- ST CLOTHING — STORE SETTINGS SCHEMA & RLS MIGRATION
-- Supports: Front-end Order/Bag feature toggle, real-time store identity,
-- phone numbers, location, social handles, business hours, and delivery notes.
-- ==============================================================================

-- 1. CREATE STORE SETTINGS TABLE
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
    
    -- Flexible JSONB for nested or future extensible settings
    settings jsonb default '{}'::jsonb,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments for database documentation
comment on table public.store_settings is 'Stores global storefront configuration, order/bag feature toggles, and brand metadata';
comment on column public.store_settings.orders_enabled is 'Toggles online/WhatsApp ordering on the front end';
comment on column public.store_settings.bag_enabled is 'Toggles the shopping bag drawer and cart buttons';
comment on column public.store_settings.accent_color is 'Brand theme accent HEX color dynamically applied across the storefront';

-- 2. TRIGGER FOR UPDATED_AT TIMESTAMP
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

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.store_settings enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public can view store settings" on public.store_settings;
drop policy if exists "Admins can insert store settings" on public.store_settings;
drop policy if exists "Admins can update store settings" on public.store_settings;

-- Public can view active store settings
create policy "Public can view store settings"
    on public.store_settings for select
    using (true);

-- Only authenticated admins can insert store settings
create policy "Admins can insert store settings"
    on public.store_settings for insert
    with check (public.is_admin() or auth.role() = 'service_role');

-- Only authenticated admins can update store settings
create policy "Admins can update store settings"
    on public.store_settings for update
    using (public.is_admin() or auth.role() = 'service_role');

-- 4. SEED INITIAL DEFAULT SETTINGS ROW
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
