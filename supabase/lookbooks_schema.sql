-- ==============================================================================
-- ST CLOTHING — LOOKBOOKS SCHEMA & RLS MIGRATION
-- Supports: Creating, Editing, Publishing, and Deleting Editorial Lookbooks
-- ==============================================================================

-- 1. CREATE LOOKBOOKS TABLE
create table if not exists public.lookbooks (
    id text primary key default gen_random_uuid()::text,
    vol text not null default 'VOL. 01',
    title text not null default 'Editorial Collection',
    subtitle text default '35MM TEMA HARBOR ARCHIVE',
    description text not null default 'A visual anthology of form, fabric density, and coastal Ghanaian atmosphere.',
    image_url text not null,
    
    -- Optional Linked Featured Garment
    featured_product_id text references public.products(id) on delete set null,
    featured_product_slug text,
    featured_product_name text,
    featured_product_price numeric(10, 2),
    
    -- Display Ordering & Status
    sort_order integer not null default 0,
    published boolean not null default true,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments for database documentation
comment on table public.lookbooks is 'Stores editorial lookbooks, campaign essays, and featured piece callouts';
comment on column public.lookbooks.vol is 'Editorial volume code (e.g. VOL. 01, SPECIAL DROP)';
comment on column public.lookbooks.featured_product_id is 'Optional garment linked directly to the lookbook spread';

-- 2. TRIGGER FOR UPDATED_AT TIMESTAMP
create or replace function public.handle_lookbooks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_lookbooks_updated_at on public.lookbooks;
create trigger set_lookbooks_updated_at
  before update on public.lookbooks
  for each row execute function public.handle_lookbooks_updated_at();

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.lookbooks enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Public can view published lookbooks" on public.lookbooks;
drop policy if exists "Admins can view all lookbooks" on public.lookbooks;
drop policy if exists "Admins can insert lookbooks" on public.lookbooks;
drop policy if exists "Admins can update lookbooks" on public.lookbooks;
drop policy if exists "Admins can delete lookbooks" on public.lookbooks;

-- Public can view published lookbooks
create policy "Public can view published lookbooks"
    on public.lookbooks for select
    using (published = true);

-- Admins can view all lookbooks (including drafts)
create policy "Admins can view all lookbooks"
    on public.lookbooks for select
    using (public.is_admin() or auth.role() = 'service_role');

-- Admins can insert lookbooks
create policy "Admins can insert lookbooks"
    on public.lookbooks for insert
    with check (public.is_admin() or auth.role() = 'service_role');

-- Admins can update lookbooks
create policy "Admins can update lookbooks"
    on public.lookbooks for update
    using (public.is_admin() or auth.role() = 'service_role');

-- Admins can delete lookbooks
create policy "Admins can delete lookbooks"
    on public.lookbooks for delete
    using (public.is_admin() or auth.role() = 'service_role');

-- 4. SEED INITIAL LOOKBOOKS
insert into public.lookbooks (
    id,
    vol,
    title,
    subtitle,
    description,
    image_url,
    featured_product_id,
    featured_product_slug,
    featured_product_name,
    featured_product_price,
    sort_order,
    published
) values 
(
    'lb-01',
    'VOL. 01',
    'Monolithic Heavyweight Essentials',
    '35MM HARBOR ARCHIVE',
    'Shot against the industrial geometry of Tema Harbor. 450 GSM double-faced loopback terry structured with dropped shoulders and raw clean hemlines.',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
    '22222222-2222-2222-2222-222222222201',
    'st-essential-oversized-tee',
    'Heavyweight Oversized Tee',
    250.00,
    1,
    true
),
(
    'lb-02',
    'VOL. 02',
    'Architectural Tailored Trousers',
    'COASTAL DRAPE // TEMA ATELIER',
    'Constructed from Japanese selvedge twill and high-density cotton. A relaxed tapered silhouette engineered to balance tropical airflow and sharp editorial lines.',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85',
    '22222222-2222-2222-2222-222222222203',
    'st-relaxed-tailored-trousers',
    'Relaxed Tailored Trousers',
    480.00,
    2,
    true
),
(
    'lb-03',
    'VOL. 03',
    'Sculpted Minimalist Outerwear',
    'COMMUNITY 1 STUDIO ARCHIVE',
    'Unbleached natural virgin wool blend and matte ripstop. Clean horn hardware and unlined drape that moves effortlessly with the body.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85',
    '22222222-2222-2222-2222-222222222202',
    'st-structured-monochrome-hoodie',
    'Structured Monochrome Hoodie',
    380.00,
    3,
    true
)
on conflict (id) do nothing;
