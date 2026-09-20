import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Product, Category, Order, OrderStatus, ProductImage, ProductVariant, Lookbook } from '@/types/database';
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_ORDERS, SEED_LOOKBOOKS } from './seed-products';
import {
  getBrowserCache,
  setBrowserCache,
  invalidateBrowserCache,
  cacheBrowserImage,
  cacheBrowserImages,
} from './browser-cache';

// Local storage keys for local fallback store
const STORAGE_KEY_PRODUCTS = 'st_clothing_products_v1';
const STORAGE_KEY_CATEGORIES = 'st_clothing_categories_v1';
const STORAGE_KEY_ORDERS = 'st_clothing_orders_v1';
const STORAGE_KEY_LOOKBOOKS = 'st_clothing_lookbooks_v1';

// Helper to get local data
function getLocalStore(): { products: Product[]; categories: Category[]; orders: Order[]; lookbooks: Lookbook[] } {
  if (typeof window === 'undefined') {
    return {
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,
      orders: SEED_ORDERS,
      lookbooks: SEED_LOOKBOOKS,
    };
  }

  try {
    const productsJson = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    const categoriesJson = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    const ordersJson = localStorage.getItem(STORAGE_KEY_ORDERS);
    const lookbooksJson = localStorage.getItem(STORAGE_KEY_LOOKBOOKS);

    const products = productsJson ? JSON.parse(productsJson) : SEED_PRODUCTS;
    const categories = categoriesJson ? JSON.parse(categoriesJson) : SEED_CATEGORIES;
    const orders = ordersJson ? JSON.parse(ordersJson) : SEED_ORDERS;
    const lookbooks = lookbooksJson ? JSON.parse(lookbooksJson) : SEED_LOOKBOOKS;

    return { products, categories, orders, lookbooks };
  } catch (err) {
    console.error('Error reading local fallback store:', err);
    return {
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,
      orders: SEED_ORDERS,
      lookbooks: SEED_LOOKBOOKS,
    };
  }
}

function saveLocalProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }
}

function saveLocalCategories(categories: Category[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }
}

function saveLocalLookbooks(lookbooks: Lookbook[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_LOOKBOOKS, JSON.stringify(lookbooks));
  }
}

// -----------------------------------------------------------------------------
// CATEGORY OPERATIONS
// -----------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const cacheKey = 'categories';

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      const cats = data as Category[];
      if (typeof window !== 'undefined') {
        setBrowserCache(cacheKey, cats, 15 * 60 * 1000);
        cacheBrowserImages(cats.map((c) => c.image_url));
      }
      return cats;
    }
    if (error) {
      console.error('Error fetching categories from database:', error);
    }

    // Network / DB failure fallback: read from browser cache
    if (typeof window !== 'undefined') {
      const cached = await getBrowserCache<Category[]>(cacheKey);
      if (cached?.data) {
        return cached.data;
      }
    }
    return [];
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const cached = await getBrowserCache<Category[]>(cacheKey);
    if (cached?.data) {
      return cached.data;
    }
  }

  const store = getLocalStore();
  return store.categories;
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const newCat: Category = {
    id: category.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`),
    name: category.name || 'New Category',
    slug: category.slug || 'new-category',
    description: category.description || null,
    image_url: category.image_url || null,
    sort_order: category.sort_order || 99,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    invalidateBrowserCache('categories');
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').insert([newCat]).select().single();
    if (!error && data) {
      if (typeof window !== 'undefined') {
        invalidateBrowserCache('categories');
      }
      return data as Category;
    }
  }

  const store = getLocalStore();
  const updated = [...store.categories, newCat];
  saveLocalCategories(updated);
  return newCat;
}

// -----------------------------------------------------------------------------
// PRODUCT OPERATIONS
// -----------------------------------------------------------------------------

export async function getProducts(options?: {
  publishedOnly?: boolean;
  categoryId?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  newArrivalsOnly?: boolean;
}): Promise<Product[]> {
  const cacheKey = `products_${JSON.stringify(options || {})}`;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (options?.publishedOnly !== false) {
      query = query.eq('published', true);
    }
    if (options?.featuredOnly) {
      query = query.eq('featured', true);
    }
    if (options?.newArrivalsOnly) {
      query = query.eq('new_arrival', true);
    }
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    const { data, error } = await query;

    if (!error && data) {
      let results = data as Product[];
      if (options?.categorySlug && options.categorySlug !== 'all') {
        results = results.filter((p) => p.category?.slug === options.categorySlug);
      }

      if (typeof window !== 'undefined') {
        setBrowserCache(cacheKey, results, 10 * 60 * 1000);
        // Pre-cache all loaded product images in browser cache
        const allImgs: string[] = [];
        results.forEach((p) => {
          p.images?.forEach((img) => {
            if (img.image_url) allImgs.push(img.image_url);
          });
        });
        cacheBrowserImages(allImgs);
      }

      return results;
    }

    if (error) {
      console.error('Error fetching products from database:', error);
    }

    // Network / DB failure fallback: read from browser cache
    if (typeof window !== 'undefined') {
      const cached = await getBrowserCache<Product[]>(cacheKey);
      if (cached?.data) {
        return cached.data;
      }
    }
    return [];
  }

  // Fallback to local store only when Supabase is not configured
  if (typeof window !== 'undefined') {
    const cached = await getBrowserCache<Product[]>(cacheKey);
    if (cached?.data) {
      return cached.data;
    }
  }

  const store = getLocalStore();
  let results = [...store.products];

  if (options?.publishedOnly !== false) {
    results = results.filter((p) => p.published);
  }
  if (options?.featuredOnly) {
    results = results.filter((p) => p.featured);
  }
  if (options?.newArrivalsOnly) {
    results = results.filter((p) => p.new_arrival);
  }
  if (options?.categoryId) {
    results = results.filter((p) => p.category_id === options.categoryId);
  }
  if (options?.categorySlug && options.categorySlug !== 'all') {
    results = results.filter((p) => p.category?.slug === options.categorySlug);
  }

  return results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cacheKey = `product_slug_${slug}`;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      const prod = data as Product;
      if (typeof window !== 'undefined') {
        setBrowserCache(cacheKey, prod, 15 * 60 * 1000);
        cacheBrowserImages(prod.images?.map((i) => i.image_url) || []);
      }
      return prod;
    }
    if (error) {
      console.error(`Error fetching product by slug ${slug}:`, error);
    }

    // Network / DB failure fallback: read from browser cache
    if (typeof window !== 'undefined') {
      const cached = await getBrowserCache<Product>(cacheKey);
      if (cached?.data) {
        return cached.data;
      }
    }
    return null;
  }

  if (typeof window !== 'undefined') {
    const cached = await getBrowserCache<Product>(cacheKey);
    if (cached?.data) {
      return cached.data;
    }
  }

  const store = getLocalStore();
  const found = store.products.find((p) => p.slug === slug);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const cacheKey = `product_id_${id}`;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      const prod = data as Product;
      if (typeof window !== 'undefined') {
        setBrowserCache(cacheKey, prod, 15 * 60 * 1000);
        cacheBrowserImages(prod.images?.map((i) => i.image_url) || []);
      }
      return prod;
    }
    if (error) {
      console.error(`Error fetching product by id ${id}:`, error);
    }

    // Network / DB failure fallback: read from browser cache
    if (typeof window !== 'undefined') {
      const cached = await getBrowserCache<Product>(cacheKey);
      if (cached?.data) {
        return cached.data;
      }
    }
    return null;
  }

  if (typeof window !== 'undefined') {
    const cached = await getBrowserCache<Product>(cacheKey);
    if (cached?.data) {
      return cached.data;
    }
  }

  const store = getLocalStore();
  const found = store.products.find((p) => p.id === id);
  return found || null;
}

export async function createProduct(
  productData: {
    name: string;
    slug: string;
    description: string;
    price: number;
    compare_at_price?: number | null;
    category_id?: string | null;
    featured?: boolean;
    published?: boolean;
    new_arrival?: boolean;
    images?: { image_url: string; storage_path?: string; alt_text?: string; is_primary?: boolean; sort_order?: number }[];
    variants?: { size: string; color: string; stock_quantity: number; sku?: string }[];
  }
): Promise<Product> {
  const productId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;
  const now = new Date().toISOString();

  const formattedImages: ProductImage[] = (productData.images || []).map((img, idx) => ({
    id: `img-${Date.now()}-${idx}`,
    product_id: productId,
    image_url: img.image_url,
    storage_path: img.storage_path || null,
    alt_text: img.alt_text || `${productData.name} image ${idx + 1}`,
    sort_order: img.sort_order ?? idx + 1,
    is_primary: img.is_primary ?? idx === 0,
    created_at: now,
  }));

  const formattedVariants: ProductVariant[] = (productData.variants || []).map((v, idx) => ({
    id: `var-${Date.now()}-${idx}`,
    product_id: productId,
    size: v.size,
    color: v.color,
    stock_quantity: Number(v.stock_quantity) || 0,
    sku: v.sku || null,
    created_at: now,
    updated_at: now,
  }));

  const newProduct: Product = {
    id: productId,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    price: Number(productData.price),
    compare_at_price: productData.compare_at_price ? Number(productData.compare_at_price) : null,
    category_id: productData.category_id || null,
    featured: Boolean(productData.featured),
    published: productData.published !== undefined ? productData.published : true,
    new_arrival: Boolean(productData.new_arrival),
    created_at: now,
    updated_at: now,
    images: formattedImages,
    variants: formattedVariants,
  };

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    // 1. Insert product base
    const { data: prodRecord, error: prodErr } = await supabase
      .from('products')
      .insert([
        {
          id: productId,
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          compare_at_price: productData.compare_at_price,
          category_id: productData.category_id,
          featured: productData.featured,
          published: productData.published,
          new_arrival: productData.new_arrival,
        },
      ])
      .select()
      .single();

    if (prodErr) {
      console.error('Supabase product create error:', prodErr);
    } else {
      // 2. Insert images
      if (formattedImages.length > 0) {
        await supabase.from('product_images').insert(formattedImages);
      }
      // 3. Insert variants
      if (formattedVariants.length > 0) {
        await supabase.from('product_variants').insert(formattedVariants);
      }

      if (typeof window !== 'undefined') {
        invalidateBrowserCache('product');
      }

      return newProduct;
    }
  }

  // Local fallback
  const store = getLocalStore();
  const matchedCategory = store.categories.find((c) => c.id === productData.category_id) || null;
  newProduct.category = matchedCategory;

  const updatedProducts = [newProduct, ...store.products];
  saveLocalProducts(updatedProducts);

  if (typeof window !== 'undefined') {
    invalidateBrowserCache('product');
  }

  return newProduct;
}

export async function updateProduct(
  id: string,
  productData: {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    compare_at_price?: number | null;
    category_id?: string | null;
    featured?: boolean;
    published?: boolean;
    new_arrival?: boolean;
    images?: { id?: string; image_url: string; storage_path?: string; alt_text?: string; is_primary?: boolean; sort_order?: number }[];
    variants?: { id?: string; size: string; color: string; stock_quantity: number; sku?: string }[];
  }
): Promise<Product | null> {
  const now = new Date().toISOString();

  if (typeof window !== 'undefined') {
    invalidateBrowserCache('product');
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const updatePayload: Record<string, any> = { updated_at: now };
    if (productData.name !== undefined) updatePayload.name = productData.name;
    if (productData.slug !== undefined) updatePayload.slug = productData.slug;
    if (productData.description !== undefined) updatePayload.description = productData.description;
    if (productData.price !== undefined) updatePayload.price = Number(productData.price);
    if (productData.compare_at_price !== undefined) updatePayload.compare_at_price = productData.compare_at_price;
    if (productData.category_id !== undefined) updatePayload.category_id = productData.category_id;
    if (productData.featured !== undefined) updatePayload.featured = productData.featured;
    if (productData.published !== undefined) updatePayload.published = productData.published;
    if (productData.new_arrival !== undefined) updatePayload.new_arrival = productData.new_arrival;

    const { error: prodErr } = await supabase.from('products').update(updatePayload).eq('id', id);
    if (!prodErr) {
      if (productData.images) {
        // Replace product images
        await supabase.from('product_images').delete().eq('product_id', id);
        const newImages = productData.images.map((img, idx) => ({
          product_id: id,
          image_url: img.image_url,
          storage_path: img.storage_path || null,
          alt_text: img.alt_text || '',
          sort_order: img.sort_order ?? idx + 1,
          is_primary: img.is_primary ?? idx === 0,
        }));
        if (newImages.length > 0) {
          await supabase.from('product_images').insert(newImages);
        }
      }

      if (productData.variants) {
        await supabase.from('product_variants').delete().eq('product_id', id);
        const newVars = productData.variants.map((v) => ({
          product_id: id,
          size: v.size,
          color: v.color,
          stock_quantity: Number(v.stock_quantity) || 0,
          sku: v.sku || null,
        }));
        if (newVars.length > 0) {
          await supabase.from('product_variants').insert(newVars);
        }
      }
      return getProductById(id);
    }
  }

  // Fallback
  const store = getLocalStore();
  const existingIndex = store.products.findIndex((p) => p.id === id);
  if (existingIndex === -1) return null;

  const existing = store.products[existingIndex];
  const matchedCategory = productData.category_id
    ? store.categories.find((c) => c.id === productData.category_id) || null
    : existing.category;

  const updatedImages: ProductImage[] = productData.images
    ? productData.images.map((img, idx) => ({
        id: img.id || `img-${Date.now()}-${idx}`,
        product_id: id,
        image_url: img.image_url,
        storage_path: img.storage_path || null,
        alt_text: img.alt_text || `${productData.name || existing.name} image`,
        sort_order: img.sort_order ?? idx + 1,
        is_primary: img.is_primary ?? idx === 0,
        created_at: now,
      }))
    : existing.images || [];

  const updatedVariants: ProductVariant[] = productData.variants
    ? productData.variants.map((v, idx) => ({
        id: v.id || `var-${Date.now()}-${idx}`,
        product_id: id,
        size: v.size,
        color: v.color,
        stock_quantity: Number(v.stock_quantity) || 0,
        sku: v.sku || null,
        created_at: now,
        updated_at: now,
      }))
    : existing.variants || [];

  const updatedProduct: Product = {
    ...existing,
    name: productData.name !== undefined ? productData.name : existing.name,
    slug: productData.slug !== undefined ? productData.slug : existing.slug,
    description: productData.description !== undefined ? productData.description : existing.description,
    price: productData.price !== undefined ? Number(productData.price) : existing.price,
    compare_at_price:
      productData.compare_at_price !== undefined ? productData.compare_at_price : existing.compare_at_price,
    category_id: productData.category_id !== undefined ? productData.category_id : existing.category_id,
    category: matchedCategory,
    featured: productData.featured !== undefined ? productData.featured : existing.featured,
    published: productData.published !== undefined ? productData.published : existing.published,
    new_arrival: productData.new_arrival !== undefined ? productData.new_arrival : existing.new_arrival,
    images: updatedImages,
    variants: updatedVariants,
    updated_at: now,
  };

  store.products[existingIndex] = updatedProduct;
  saveLocalProducts(store.products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    invalidateBrowserCache('product');
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    // Fetch image storage paths to clean up if any
    const { data: images } = await supabase.from('product_images').select('storage_path').eq('product_id', id);
    if (images && images.length > 0) {
      const pathsToDelete = images.map((img) => img.storage_path).filter(Boolean) as string[];
      if (pathsToDelete.length > 0) {
        await supabase.storage.from('product-images').remove(pathsToDelete);
      }
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) return true;
  }

  const store = getLocalStore();
  const filtered = store.products.filter((p) => p.id !== id);
  saveLocalProducts(filtered);
  return true;
}

// -----------------------------------------------------------------------------
// STORAGE OPERATIONS
// -----------------------------------------------------------------------------

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ imageUrl: string; storagePath: string }> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop() || 'webp';
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(data.path);
      return {
        imageUrl: publicUrlData.publicUrl,
        storagePath: data.path,
      };
    }
    console.warn('Storage upload error, using object URL fallback:', error);
  }

  // Fallback: Convert file to Base64 or Blob URL for client preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        imageUrl: reader.result as string,
        storagePath: `local-${file.name}`,
      });
    };
    reader.readAsDataURL(file);
  });
}

// -----------------------------------------------------------------------------
// ORDER OPERATIONS
// -----------------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as Order[];
    }
    if (error) {
      console.error('Error fetching orders from database:', error);
    }
    return [];
  }

  const store = getLocalStore();
  return store.orders;
}

function isValidUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  delivery_address: string;
  city?: string;
  postal_code?: string;
  country?: string;
  total_amount: number;
  notes?: string;
  items: {
    product_id?: string;
    product_name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image_url?: string;
  }[];
}): Promise<Order> {
  const orderId = generateUuid();
  const now = new Date().toISOString();

  const formattedItems = orderData.items.map((item) => ({
    id: generateUuid(),
    order_id: orderId,
    product_id: item.product_id && isValidUuid(item.product_id) ? item.product_id : null,
    product_name: item.product_name,
    quantity: Number(item.quantity) || 1,
    price: Number(item.price) || 0,
    size: item.size || null,
    color: item.color || null,
    image_url: item.image_url || null,
    created_at: now,
  }));

  const newOrder: Order = {
    id: orderId,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone || null,
    delivery_address: orderData.delivery_address,
    city: orderData.city || null,
    postal_code: orderData.postal_code || null,
    country: orderData.country || 'Ghana',
    total_amount: Number(orderData.total_amount) || 0,
    status: 'pending',
    notes: orderData.notes || null,
    created_at: now,
    updated_at: now,
    items: formattedItems,
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { error: ordErr } = await supabase.from('orders').insert([
        {
          id: orderId,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone || null,
          delivery_address: orderData.delivery_address,
          city: orderData.city || null,
          postal_code: orderData.postal_code || null,
          country: orderData.country || 'Ghana',
          total_amount: Number(orderData.total_amount) || 0,
          status: 'pending',
          notes: orderData.notes || null,
          created_at: now,
          updated_at: now,
        },
      ]);

      if (ordErr) {
        console.error('Supabase order insert error:', ordErr);
      } else {
        if (formattedItems.length > 0) {
          const { error: itemsErr } = await supabase.from('order_items').insert(formattedItems);
          if (itemsErr) {
            console.error('Supabase order_items insert error:', itemsErr);
          }
        }
        return newOrder;
      }
    } catch (e) {
      console.error('Exception during Supabase order insertion:', e);
    }
  }

  const store = getLocalStore();
  const updatedOrders = [newOrder, ...store.orders];
  saveLocalOrders(updatedOrders);
  return newOrder;
}

export async function getOrderByIdAndEmail(orderId: string, email: string): Promise<Order | null> {
  const cleanId = orderId.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanId || !cleanEmail) return null;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .ilike('customer_email', cleanEmail);

    if (isValidUuid(cleanId)) {
      query = query.eq('id', cleanId);
    } else {
      query = query.ilike('id', `${cleanId}%`);
    }

    const { data, error } = await query.maybeSingle();
    if (!error && data) {
      return data as Order;
    }
    if (error) {
      console.error(`Error fetching order by id ${cleanId} and email:`, error);
    }
  }

  const store = getLocalStore();
  const found = (store.orders || []).find((o) => {
    const idMatch =
      o.id.toLowerCase() === cleanId.toLowerCase() ||
      o.id.toLowerCase().startsWith(cleanId.toLowerCase());
    const emailMatch = o.customer_email.trim().toLowerCase() === cleanEmail;
    return idMatch && emailMatch;
  });

  return found || null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const cleanId = id.trim();
  if (!cleanId) return null;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase.from('orders').select('*, items:order_items(*)');
    if (isValidUuid(cleanId)) {
      query = query.eq('id', cleanId);
    } else {
      query = query.ilike('id', `${cleanId}%`);
    }

    const { data, error } = await query.maybeSingle();
    if (!error && data) {
      return data as Order;
    }
    if (error) {
      console.error(`Error fetching order by id ${cleanId}:`, error);
    }
  }

  const store = getLocalStore();
  const found = (store.orders || []).find(
    (o) => o.id.toLowerCase() === cleanId.toLowerCase() || o.id.toLowerCase().startsWith(cleanId.toLowerCase())
  );
  return found || null;
}

export async function trackOrder(searchTerm: string): Promise<Order[]> {
  const term = searchTerm.trim();
  if (!term) return [];

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase.from('orders').select('*, items:order_items(*)');

    if (isValidUuid(term)) {
      query = query.eq('id', term);
    } else if (term.includes('@')) {
      query = query.ilike('customer_email', `%${term}%`);
    } else if (term.replace(/[^0-9]/g, '').length >= 7) {
      query = query.ilike('customer_phone', `%${term.replace(/[^0-9]/g, '')}%`);
    } else {
      query = query.ilike('id', `${term}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) {
      return data as Order[];
    }
    if (error) {
      console.error('Error tracking order from database:', error);
    }
  }

  const store = getLocalStore();
  const lower = term.toLowerCase();
  const cleanPhone = term.replace(/[^0-9]/g, '');
  return (store.orders || []).filter(
    (o) =>
      o.id.toLowerCase().includes(lower) ||
      o.customer_email.toLowerCase().includes(lower) ||
      (cleanPhone.length >= 6 && o.customer_phone && o.customer_phone.replace(/[^0-9]/g, '').includes(cleanPhone))
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from('orders').update({ status, updated_at: now }).eq('id', orderId);
    if (!error) return true;
  }

  const store = getLocalStore();
  const orderIndex = store.orders.findIndex((o) => o.id === orderId);
  if (orderIndex !== -1) {
    store.orders[orderIndex].status = status;
    store.orders[orderIndex].updated_at = now;
    saveLocalOrders(store.orders);
    return true;
  }
  return false;
}

// -----------------------------------------------------------------------------
// LOOKBOOK OPERATIONS
// -----------------------------------------------------------------------------

export async function getLookbooks(options?: { publishedOnly?: boolean }): Promise<Lookbook[]> {
  const cacheKey = `lookbooks_${JSON.stringify(options || {})}`;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    let query = supabase.from('lookbooks').select('*').order('sort_order', { ascending: true });
    
    if (options?.publishedOnly) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (!error && data) {
      const lookbooks = data as Lookbook[];
      if (typeof window !== 'undefined') {
        setBrowserCache(cacheKey, lookbooks, 15 * 60 * 1000);
        cacheBrowserImages(lookbooks.map((l) => l.image_url).filter(Boolean));
      }
      return lookbooks;
    }
    if (error) {
      console.error('Error fetching lookbooks from database:', error);
    }

    // Network / DB failure fallback: read from browser cache
    if (typeof window !== 'undefined') {
      const cached = await getBrowserCache<Lookbook[]>(cacheKey);
      if (cached?.data) {
        return cached.data;
      }
    }
    return [];
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const cached = await getBrowserCache<Lookbook[]>(cacheKey);
    if (cached?.data) {
      return cached.data;
    }
  }

  const store = getLocalStore();
  let list = store.lookbooks || [];
  if (options?.publishedOnly) {
    list = list.filter((item) => item.published !== false);
  }
  const localLookbooks = [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return localLookbooks;
}

export async function getLookbookById(id: string): Promise<Lookbook | null> {
  const cacheKey = `lookbook_id_${id}`;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.from('lookbooks').select('*').eq('id', id).maybeSingle();
    if (!error && data) {
      const lookbook = data as Lookbook;
      if (typeof window !== 'undefined') {
        setBrowserCache(cacheKey, lookbook, 15 * 60 * 1000);
        if (lookbook.image_url) {
          cacheBrowserImage(lookbook.image_url);
        }
      }
      return lookbook;
    }
    if (error) {
      console.error(`Error fetching lookbook by id ${id}:`, error);
    }

    // Network / DB failure fallback: read from browser cache
    if (typeof window !== 'undefined') {
      const cached = await getBrowserCache<Lookbook>(cacheKey);
      if (cached?.data) {
        return cached.data;
      }
    }
    return null;
  }

  if (typeof window !== 'undefined') {
    const cached = await getBrowserCache<Lookbook>(cacheKey);
    if (cached?.data) {
      return cached.data;
    }
  }

  const store = getLocalStore();
  const item = (store.lookbooks || []).find((l) => l.id === id);
  return item || null;
}

export async function createLookbook(lookbookData: Partial<Lookbook>): Promise<Lookbook> {
  const id = lookbookData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lookbook-${Date.now()}`);
  const now = new Date().toISOString();

  if (typeof window !== 'undefined') {
    invalidateBrowserCache('lookbook');
  }

  const newLookbook: Lookbook = {
    id,
    vol: lookbookData.vol || 'VOL. 01',
    title: lookbookData.title || 'Editorial Collection',
    subtitle: lookbookData.subtitle || '35MM TEMA ARCHIVE',
    description: lookbookData.description || '',
    image_url: lookbookData.image_url || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    featured_product_id: lookbookData.featured_product_id || null,
    featured_product_slug: lookbookData.featured_product_slug || null,
    featured_product_name: lookbookData.featured_product_name || null,
    featured_product_price: lookbookData.featured_product_price !== undefined ? lookbookData.featured_product_price : null,
    sort_order: lookbookData.sort_order !== undefined ? lookbookData.sort_order : 0,
    published: lookbookData.published !== undefined ? lookbookData.published : true,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase.from('lookbooks').insert([newLookbook]).select().single();
    if (!error && data) {
      if (typeof window !== 'undefined') {
        invalidateBrowserCache('lookbook');
        if (data.image_url) cacheBrowserImage(data.image_url);
      }
      return data as Lookbook;
    }
  }

  const store = getLocalStore();
  const updated = [...(store.lookbooks || []), newLookbook];
  saveLocalLookbooks(updated);
  return newLookbook;
}

export async function updateLookbook(id: string, lookbookData: Partial<Lookbook>): Promise<Lookbook | null> {
  const now = new Date().toISOString();

  if (typeof window !== 'undefined') {
    invalidateBrowserCache('lookbook');
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('lookbooks')
      .update({
        ...lookbookData,
        updated_at: now,
      })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      if (typeof window !== 'undefined') {
        invalidateBrowserCache('lookbook');
        if (data.image_url) cacheBrowserImage(data.image_url);
      }
      return data as Lookbook;
    }
  }

  const store = getLocalStore();
  const index = (store.lookbooks || []).findIndex((l) => l.id === id);
  if (index !== -1) {
    const updatedLookbook: Lookbook = {
      ...store.lookbooks[index],
      ...lookbookData,
      updated_at: now,
    };
    store.lookbooks[index] = updatedLookbook;
    saveLocalLookbooks(store.lookbooks);
    return updatedLookbook;
  }
  return null;
}

export async function deleteLookbook(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    invalidateBrowserCache('lookbook');
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from('lookbooks').delete().eq('id', id);
    if (!error) return true;
  }

  const store = getLocalStore();
  const filtered = (store.lookbooks || []).filter((l) => l.id !== id);
  saveLocalLookbooks(filtered);
  return true;
}

