export type UserRole = 'admin' | 'customer';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path?: string | null;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock_quantity: number;
  sku?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  category_id?: string | null;
  featured: boolean;
  published: boolean;
  new_arrival: boolean;
  created_at: string;
  updated_at: string;
  // Joined relations
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  // Virtual computed fields
  total_stock?: number;
  primary_image?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  image_url?: string | null;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  delivery_address: string;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  total_amount: number;
  status: OrderStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export interface StoreSettingsRow {
  id: string;
  orders_enabled: boolean;
  bag_enabled: boolean;
  ordering_disabled_notice?: string | null;
  store_name: string;
  tagline?: string | null;
  description?: string | null;
  accent_color: string;
  currency_symbol: string;
  primary_phone: string;
  primary_phone_display: string;
  primary_whatsapp: string;
  secondary_phone?: string | null;
  secondary_phone_display?: string | null;
  secondary_whatsapp?: string | null;
  email?: string | null;
  city: string;
  region: string;
  country: string;
  full_address: string;
  map_query?: string | null;
  business_hours?: string | null;
  business_hours_sunday?: string | null;
  instagram_handle?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  tiktok_url?: string | null;
  delivery_info?: string | null;
  payment_methods?: string | null;
  settings?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
