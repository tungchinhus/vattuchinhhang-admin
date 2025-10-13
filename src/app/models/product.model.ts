export interface Category {
  id: string;
  name: string;
  slug: string; // SEO-friendly identifier
  description?: string;
  createdAt: Date;
}

export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface ProductAdminReview {
  reviewedBy: string;
  reviewedAt: Date;
  note?: string;
}

export interface Product {
  id: string;
  supplierId: string; // users/{supplierId}
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  images: string[];
  category: string; // categoryId
  specs?: Record<string, any>; // detailed technical specs
  stock: number;
  status: ProductStatus;
  adminReview?: ProductAdminReview;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  supplierId: string;
  productId: string;
  customerId: string;
  rating: number; // 0-5
  comment?: string;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
  supplierId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string; // users/{customerId}
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

