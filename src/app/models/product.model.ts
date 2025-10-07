export interface Product {
  id: string;
  name: string;
  model: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: ProductSpecification[];
  features: string[];
  images: string[];
  status: ProductStatus;
  stock: number;
  sku: string;
  warranty: string;
  origin: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  discount?: number;
}

export enum ProductCategory {
  WATER_FILTER_STANDING = 'water_filter_standing',
  WATER_FILTER_UNDER_SINK = 'water_filter_under_sink',
  HOT_COLD_WATER = 'hot_cold_water',
  HYDRO_ALKALINE = 'hydro_alkaline',
  INDUSTRIAL_FILTER = 'industrial_filter',
  FILTER_CARTRIDGE = 'filter_cartridge',
  TOTAL_FILTER_PREMIUM = 'total_filter_premium',
  TOTAL_FILTER_SOURCE = 'total_filter_source'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
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
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
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
  specifications: ProductSpecification[];
  features: string[];
  images: string[];
  status: ProductStatus;
  stock: number;
  sku: string;
  warranty: string;
  origin: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  discount?: number;
}

// Category display names
export const CATEGORY_DISPLAY_NAMES: Record<ProductCategory, string> = {
  [ProductCategory.WATER_FILTER_STANDING]: 'Máy lọc nước tủ đứng',
  [ProductCategory.WATER_FILTER_UNDER_SINK]: 'Máy lọc nước để gầm',
  [ProductCategory.HOT_COLD_WATER]: 'Máy lọc nước nóng lạnh',
  [ProductCategory.HYDRO_ALKALINE]: 'Hydro-ion Kiềm',
  [ProductCategory.INDUSTRIAL_FILTER]: 'Máy lọc nước bán công nghiệp',
  [ProductCategory.FILTER_CARTRIDGE]: 'Lõi Lọc Thay Thế',
  [ProductCategory.TOTAL_FILTER_PREMIUM]: 'Lọc tổng cao cấp',
  [ProductCategory.TOTAL_FILTER_SOURCE]: 'Lọc tổng - Đầu nguồn'
};

// Status display names
export const STATUS_DISPLAY_NAMES: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: 'Đang bán',
  [ProductStatus.INACTIVE]: 'Tạm ngưng',
  [ProductStatus.OUT_OF_STOCK]: 'Hết hàng',
  [ProductStatus.DISCONTINUED]: 'Ngừng sản xuất'
};
