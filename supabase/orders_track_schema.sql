-- ==============================================================================
-- ST CLOTHING — ORDERS TRACKING & PUBLIC ACCESS POLICY
-- Run this in your Supabase SQL Editor if order tracking is restricted by RLS
-- ==============================================================================

-- 1. Ensure country defaults to 'Ghana'
alter table if exists public.orders alter column country set default 'Ghana';

-- 2. Allow public order creation (insert)
drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
    on public.orders for insert
    with check (true);

drop policy if exists "Public can insert order items" on public.order_items;
create policy "Public can insert order items"
    on public.order_items for insert
    with check (true);

-- 3. Allow public order lookup (select) by ID, Phone, or Email for customer order tracking
drop policy if exists "Public can view orders" on public.orders;
create policy "Public can view orders"
    on public.orders for select
    using (true);

drop policy if exists "Public can view order items" on public.order_items;
create policy "Public can view order items"
    on public.order_items for select
    using (true);

-- 4. Admins can update orders status
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
    on public.orders for update
    using (public.is_admin() or auth.role() = 'service_role');
