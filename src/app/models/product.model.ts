export enum ProductCategory {
  WATER_FILTER_STANDING = 'water_filter_standing',
  WATER_FILTER_UNDER_SINK = 'water_filter_under_sink',
  WATER_FILTER_HOT_COLD = 'water_filter_hot_cold',
  HYDRO_ALKALINE = 'hydro_alkaline',
  WHOLE_HOUSE_FILTER = 'whole_house_filter',
  INDUSTRIAL_FILTER = 'industrial_filter',
  REPLACEMENT_PARTS = 'replacement_parts'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  HIDDEN = 'hidden'
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductFilter {
  category?: ProductCategory;
  status?: ProductStatus;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface ProductFormData {
  name: string;
  model: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications?: ProductSpecification[];
  features?: string[];
  images?: string[];
  status: ProductStatus;
  stock: number;
  sku: string;
  warranty: string;
  origin: string;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string; // SEO-friendly identifier
  description?: string;
  createdAt: Date;
}

export interface ProductAdminReview {
  reviewedBy: string;
  reviewedAt: Date;
  note?: string;
}

export interface Product {
  id: string;
  supplierId?: string; // users/{supplierId}
  name: string;
  slug?: string;
  model?: string;
  category: ProductCategory | string; // categoryId or enum
  brand?: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  specifications?: ProductSpecification[];
  features?: string[];
  images: string[];
  specs?: Record<string, any>; // detailed technical specs
  status: ProductStatus;
  stock: number;
  sku?: string;
  warranty?: string;
  origin?: string;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  discount?: number;
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

export const CATEGORY_DISPLAY_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.WATER_FILTER_STANDING]: 'Máy lọc nước tủ đứng',
  [ProductCategory.WATER_FILTER_UNDER_SINK]: 'Máy lọc nước để gầm',
  [ProductCategory.WATER_FILTER_HOT_COLD]: 'Máy lọc nước nóng lạnh',
  [ProductCategory.HYDRO_ALKALINE]: 'Máy lọc nước Hydro-ion Kiềm',
  [ProductCategory.WHOLE_HOUSE_FILTER]: 'Lọc tổng cao cấp',
  [ProductCategory.INDUSTRIAL_FILTER]: 'Lọc nước công nghiệp',
  [ProductCategory.REPLACEMENT_PARTS]: 'Lõi lọc thay thế'
};

export const STATUS_DISPLAY_NAMES: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: 'Hoạt động',
  [ProductStatus.INACTIVE]: 'Tạm ngưng',
  [ProductStatus.OUT_OF_STOCK]: 'Hết hàng',
  [ProductStatus.DISCONTINUED]: 'Ngừng sản xuất',
  [ProductStatus.PENDING]: 'Chờ duyệt',
  [ProductStatus.APPROVED]: 'Đã duyệt',
  [ProductStatus.REJECTED]: 'Từ chối',
  [ProductStatus.HIDDEN]: 'Ẩn'
};