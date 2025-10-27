/**
 * Model cho sản phẩm đơn giản với variants và images
 * Theo cấu trúc JSON từ user
 */

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  price_adjustment: number;
  stock_quantity: number;
  final_price: number;
}

export interface ProductImage {
  image_url: string;
  alt_text: string;
  is_main?: boolean;
}

export interface ProductSimple {
  product_id: string;
  name: string;
  slug: string;
  base_price: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_order';
  is_published: boolean;
  category_refs: Record<string, boolean>; // { "cat7": true, "cat8": true }
  variants: Record<string, ProductVariant>; // { "KADX69-S": {...} }
  images?: Record<string, ProductImage>; // { "img1": {...} }
  
  // Optional fields
  description?: string;
  short_description?: string;
  created_at?: any;
  updated_at?: any;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

