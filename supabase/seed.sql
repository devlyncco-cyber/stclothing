-- ==============================================================================
-- ST CLOTHING — SEED DATASET
-- ==============================================================================

-- 1. Insert Categories
insert into public.categories (id, name, slug, description, image_url, sort_order)
values
  ('11111111-1111-1111-1111-111111111101', 'T-Shirts', 't-shirts', 'Heavyweight organic cotton staples engineered for daily wear.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', 1),
  ('11111111-1111-1111-1111-111111111102', 'Hoodies', 'hoodies', 'Sculpted silhouettes tailored in premium French terry fleece.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80', 2),
  ('11111111-1111-1111-1111-111111111103', 'Trousers', 'trousers', 'Relaxed and tapered cuts structured with technical comfort.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=80', 3),
  ('11111111-1111-1111-1111-111111111104', 'Jackets', 'jackets', 'Architectural outerwear blending minimalism with weather protection.', 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=80', 4),
  ('11111111-1111-1111-1111-111111111105', 'Accessories', 'accessories', 'Essential finishing elements crafted in monochromatic luxury.', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80', 5)
on conflict (slug) do nothing;

-- 2. Insert Products
insert into public.products (id, name, slug, description, price, compare_at_price, category_id, featured, published, new_arrival)
values
  (
    '22222222-2222-2222-2222-222222222201',
    'ST Essential Oversized Tee',
    'st-essential-oversized-tee',
    'Crafted from custom-developed 280 GSM combed organic cotton. Features dropped shoulders, a reinforced 1.25" rib collar, and a relaxed boxy drape that retains structure throughout wear.',
    55.00,
    null,
    '11111111-1111-1111-1111-111111111101',
    true,
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    'ST Signature Heavyweight Hoodie',
    'st-signature-heavyweight-hoodie',
    'Constructed from 480 GSM ultra-heavy French terry with double-needle flatlock stitching. Double-layered hood without drawstrings for an uncompromising minimalist profile.',
    120.00,
    140.00,
    '11111111-1111-1111-1111-111111111102',
    true,
    true,
    false
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    'ST Technical Cargo Trousers',
    'st-technical-cargo-trousers',
    'Engineered in durable matte nylon-blend ripstop. Features hidden magnetic pocket closures, internal bungee cinch hems for versatile silhouette adjustment, and articulated knee darts.',
    110.00,
    null,
    '11111111-1111-1111-1111-111111111103',
    true,
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    'ST Minimalist Wool Blend Jacket',
    'st-minimalist-wool-blend-jacket',
    'Cut from a luxurious double-faced wool blend with a concealed zip front placket, side welt pockets, and a clean point collar. A timeless transitional outer layer.',
    185.00,
    220.00,
    '11111111-1111-1111-1111-111111111104',
    true,
    true,
    false
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    'ST Classic Minimalist Cap',
    'st-classic-minimalist-cap',
    'Unstructured 6-panel low profile dad cap in washed cotton twill with tonal metal buckle closure and subtle ST matte metal branding tab on the strap.',
    38.00,
    null,
    '11111111-1111-1111-1111-111111111105',
    false,
    true,
    false
  ),
  (
    '22222222-2222-2222-2222-222222222206',
    'ST Tailored Pleated Trousers',
    'st-tailored-pleated-trousers',
    'Double-pleated front trousers in breathable stretch-twill with clean slant pockets and a relaxed straight-leg drape. Suitable for dressed-up or casual styling.',
    115.00,
    null,
    '11111111-1111-1111-1111-111111111103',
    false,
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222207',
    'ST Cropped Boxy Zip Hoodie',
    'st-cropped-boxy-zip-hoodie',
    'Modern cropped silhouette with exaggerated wide sleeves and custom brushed nickel two-way zipper. 420 GSM looped back terry.',
    125.00,
    null,
    '11111111-1111-1111-1111-111111111102',
    false,
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222208',
    'ST Premium Leather Cardholder',
    'st-premium-leather-cardholder',
    'Full-grain Italian calfskin with hand-painted beveled edges. Features 4 card slots and a central bill compartment with blind debossed typography.',
    45.00,
    null,
    '11111111-1111-1111-1111-111111111105',
    false,
    true,
    false
  )
on conflict (slug) do nothing;

-- 3. Insert Product Images
insert into public.product_images (product_id, image_url, alt_text, sort_order, is_primary)
values
  -- ST Essential Oversized Tee
  ('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', 'ST Essential Oversized Tee - Front', 1, true),
  ('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80', 'ST Essential Oversized Tee - Back Detail', 2, false),
  ('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80', 'ST Essential Oversized Tee - Fabric Texture', 3, false),

  -- ST Signature Heavyweight Hoodie
  ('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80', 'ST Signature Heavyweight Hoodie - Front Look', 1, true),
  ('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80', 'ST Signature Heavyweight Hoodie - Hood Profile', 2, false),

  -- ST Technical Cargo Trousers
  ('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=80', 'ST Technical Cargo Trousers - Full Length', 1, true),
  ('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80', 'ST Technical Cargo Trousers - Pocket Detail', 2, false),

  -- ST Minimalist Wool Blend Jacket
  ('22222222-2222-2222-2222-222222222204', 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=1200&q=80', 'ST Minimalist Wool Blend Jacket - Front', 1, true),
  ('22222222-2222-2222-2222-222222222204', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80', 'ST Minimalist Wool Blend Jacket - Side Profile', 2, false),

  -- ST Classic Minimalist Cap
  ('22222222-2222-2222-2222-222222222205', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80', 'ST Classic Minimalist Cap - Studio', 1, true),

  -- ST Tailored Pleated Trousers
  ('22222222-2222-2222-2222-222222222206', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80', 'ST Tailored Pleated Trousers - Fit', 1, true),

  -- ST Cropped Boxy Zip Hoodie
  ('22222222-2222-2222-2222-222222222207', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80', 'ST Cropped Boxy Zip Hoodie', 1, true),

  -- ST Premium Leather Cardholder
  ('22222222-2222-2222-2222-222222222208', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80', 'ST Premium Leather Cardholder', 1, true)
on conflict do nothing;

-- 4. Insert Product Variants
insert into public.product_variants (product_id, size, color, stock_quantity, sku)
values
  -- Tee variants
  ('22222222-2222-2222-2222-222222222201', 'S', 'Washed Black', 15, 'TEE-BLK-S'),
  ('22222222-2222-2222-2222-222222222201', 'M', 'Washed Black', 24, 'TEE-BLK-M'),
  ('22222222-2222-2222-2222-222222222201', 'L', 'Washed Black', 18, 'TEE-BLK-L'),
  ('22222222-2222-2222-2222-222222222201', 'M', 'Off-White', 12, 'TEE-WHT-M'),
  ('22222222-2222-2222-2222-222222222201', 'L', 'Off-White', 0, 'TEE-WHT-L'),

  -- Hoodie variants
  ('22222222-2222-2222-2222-222222222202', 'S', 'Pitch Black', 8, 'HOD-BLK-S'),
  ('22222222-2222-2222-2222-222222222202', 'M', 'Pitch Black', 14, 'HOD-BLK-M'),
  ('22222222-2222-2222-2222-222222222202', 'L', 'Pitch Black', 10, 'HOD-BLK-L'),
  ('22222222-2222-2222-2222-222222222202', 'XL', 'Pitch Black', 5, 'HOD-BLK-XL'),
  ('22222222-2222-2222-2222-222222222202', 'M', 'Stone Gray', 9, 'HOD-GRY-M'),

  -- Cargo Trousers
  ('22222222-2222-2222-2222-222222222203', '30', 'Stealth Black', 10, 'CRG-BLK-30'),
  ('22222222-2222-2222-2222-222222222203', '32', 'Stealth Black', 16, 'CRG-BLK-32'),
  ('22222222-2222-2222-2222-222222222203', '34', 'Stealth Black', 7, 'CRG-BLK-34'),
  ('22222222-2222-2222-2222-222222222203', '32', 'Slate Olive', 6, 'CRG-OLV-32'),

  -- Wool Jacket
  ('22222222-2222-2222-2222-222222222204', 'M', 'Charcoal', 6, 'JCK-CHR-M'),
  ('22222222-2222-2222-2222-222222222204', 'L', 'Charcoal', 4, 'JCK-CHR-L'),
  ('22222222-2222-2222-2222-222222222204', 'M', 'Onyx Black', 8, 'JCK-BLK-M'),

  -- Cap
  ('22222222-2222-2222-2222-222222222205', 'ONE SIZE', 'Matte Black', 30, 'CAP-BLK-OS'),
  ('22222222-2222-2222-2222-222222222205', 'ONE SIZE', 'Sand', 15, 'CAP-SND-OS'),

  -- Pleated Trousers
  ('22222222-2222-2222-2222-222222222206', '30', 'Black', 10, 'TRS-BLK-30'),
  ('22222222-2222-2222-2222-222222222206', '32', 'Black', 12, 'TRS-BLK-32'),

  -- Zip Hoodie
  ('22222222-2222-2222-2222-222222222207', 'S', 'Off-White', 7, 'ZHD-WHT-S'),
  ('22222222-2222-2222-2222-222222222207', 'M', 'Off-White', 11, 'ZHD-WHT-M'),

  -- Cardholder
  ('22222222-2222-2222-2222-222222222208', 'ONE SIZE', 'Noir Black', 20, 'CRD-BLK-OS')
on conflict do nothing;
