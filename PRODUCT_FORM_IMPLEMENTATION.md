# Product Form Implementation

## Overview
Đã tạo một form nhập sản phẩm hoàn chỉnh dựa trên cấu trúc JSON bạn cung cấp. Form này hỗ trợ:
- Nhập thông tin sản phẩm cơ bản
- Quản lý biến thể (variants) động
- Upload và quản lý hình ảnh với Firebase Storage
- Lưu dữ liệu vào Firestore

## Các file đã tạo

### 1. Models
**File:** `src/app/models/product-simple.model.ts`

Định nghĩa interface cho sản phẩm đơn giản bao gồm:
- `ProductSimple`: Interface chính cho sản phẩm
- `ProductVariant`: Interface cho biến thể sản phẩm
- `ProductImage`: Interface cho hình ảnh

### 2. Services

#### Storage Service
**File:** `src/app/services/storage.service.ts`

Service để upload hình ảnh lên Firebase Storage:
```typescript
// Upload single file
uploadFile(file: File, path: string, fileName?: string): Promise<string>

// Upload multiple files
uploadMultipleFiles(files: File[], path: string): Promise<string[]>

// Upload with progress tracking
uploadFileWithProgress(file: File, path: string, fileName?: string)
```

#### Product Simple Service
**File:** `src/app/services/product-simple.service.ts`

Service để CRUD sản phẩm trong Firestore:
```typescript
createProduct(data): Promise<string>
updateProduct(productId, data): Promise<void>
deleteProduct(productId): Promise<void>
getProductById(productId): Promise<ProductSimple | null>
getProductBySlug(slug): Promise<ProductSimple | null>
listProducts(): Promise<ProductSimple[]>
```

### 3. Component

**File:** `src/app/features/products/product-form/product-form.component.ts`

Component chính của form với các tính năng:
- Form validation
- Dynamic variants (thêm/xóa biến thể)
- Image upload với preview
- Auto-generate slug
- Auto-calculate final price
- Save to Firestore

**Template:** `product-form.component.html`
- Tab 1: Thông tin cơ bản
- Tab 2: Danh mục (multi-select checkbox)
- Tab 3: Biến thể (dynamic list)
- Tab 4: Hình ảnh (upload & preview)

**Styles:** `product-form.component.css`
- Responsive design
- Material UI styling
- Image gallery layout

## Cấu trúc dữ liệu lưu vào Firestore

```json
{
  "product_id": "KADX69",
  "name": "Máy Lọc Nước Nóng Lạnh KAD-X69 (10 Lõi)",
  "slug": "loc-nuoc-nong-lanh-kadx69",
  "base_price": 14420000,
  "stock_status": "in_stock",
  "is_published": true,
  "description": "...",
  "short_description": "...",
  "category_refs": {
    "cat7": true,
    "cat8": true
  },
  "variants": {
    "KADX69-S": {
      "sku": "KADX69-S",
      "size": "Tủ Đứng",
      "color": "Màu Xám Bạc",
      "price_adjustment": 0,
      "stock_quantity": 95,
      "final_price": 14420000
    }
  },
  "images": {
    "img1": {
      "image_url": "https://firebasestorage.googleapis.com/...",
      "alt_text": "Máy Lọc Nước...",
      "is_main": true
    }
  },
  "created_at": Timestamp,
  "updated_at": Timestamp
}
```

## Cách sử dụng

### 1. Import Component
```typescript
import { ProductFormComponent } from './features/products/product-form/product-form.component';

// Trong route:
{
  path: 'products/new',
  component: ProductFormComponent
}
```

### 2. Sử dụng form
1. Nhập Product ID (mã định danh duy nhất)
2. Nhập tên sản phẩm và click icon để tự động tạo slug
3. Nhập giá cơ bản
4. Chọn trạng thái tồn kho
5. Chọn danh mục (có thể chọn nhiều)
6. Thêm biến thể (ít nhất 1 biến thể):
   - SKU
   - Kích thước
   - Màu sắc
   - Điều chỉnh giá (tùy chọn)
   - Số lượng tồn kho
   - Giá cuối (tự động tính)
7. Upload hình ảnh (hình đầu tiên là ảnh chính)
8. Click "Lưu sản phẩm"

## Firebase Storage Structure
```
products/
  └── images/
      ├── KADX69_1_image.jpg
      ├── KADX69_2_image.jpg
      └── ...
```

## Tính năng nổi bật

1. **Auto-calculate final price**: Giá cuối = Giá cơ bản + Điều chỉnh giá
2. **Auto-generate slug**: Tự động tạo slug từ tên sản phẩm
3. **Image preview**: Xem trước hình ảnh trước khi upload
4. **Set main image**: Đặt ảnh chính bằng cách kéo hoặc nút
5. **Dynamic variants**: Thêm/xóa biến thể động
6. **Category multi-select**: Chọn nhiều danh mục
7. **Form validation**: Validation đầy đủ các trường bắt buộc
8. **Progress bar**: Hiển thị tiến trình upload

## Lưu ý

1. **Firestore Rules**: Cần cấu hình Firestore rules để cho phép read/write
2. **Storage Rules**: Cần cấu hình Storage rules để cho phép upload
3. **Categories**: Cần có dữ liệu categories trong Firestore trước
4. **Unique Product ID**: Product ID phải duy nhất

## Storage Rules mẫu

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.resource.size < pizzabyte &&
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Firestore Rules mẫu

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Validation Rules

Form sẽ validate:
- Product ID: Required
- Name: Required
- Slug: Required
- Base Price: Required, >= 0
- Stock Status: Required
- Variants: Ít nhất 1 biến thể
- Each variant: SKU, Size, Color, Stock Quantity, Final Price required

## Error Handling

- Hiển thị lỗi validation khi submit
- Hiển thị lỗi khi upload ảnh
- Hiển thị lỗi khi lưu Firestore
- Success message khi lưu thành công

