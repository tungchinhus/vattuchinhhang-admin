# Hệ thống Forms Quản lý Dữ liệu

Dựa trên schema dữ liệu được cung cấp, tôi đã tạo một hệ thống forms hoàn chỉnh để quản lý dữ liệu với Firebase Firestore và Storage.

## Cấu trúc Dữ liệu

### 1. Users Collection
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'admin' | 'customer';
  avatarUrl?: string;
  createdAt: Date;
}
```

### 2. Products Collection
```typescript
interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
}
```

### 3. Categories Collection
```typescript
interface Category {
  id: string;
  name: string;
  iconUrl?: string;
}
```

### 4. Orders Collection
```typescript
interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled';
  createdAt: Date;
}
```

## Các Component Forms

### 1. UserFormComponent
- **File**: `src/app/components/user-form/user-form.component.ts`
- **Chức năng**: Tạo/sửa thông tin người dùng
- **Tính năng**: Upload avatar, chọn vai trò (seller/admin/customer)

### 2. ProductFormComponent
- **File**: `src/app/components/product-form/product-form.component.ts`
- **Chức năng**: Tạo/sửa sản phẩm
- **Tính năng**: Upload nhiều hình ảnh, chọn danh mục, quản lý trạng thái

### 3. CategoryFormComponent
- **File**: `src/app/components/category-form/category-form.component.ts`
- **Chức năng**: Tạo/sửa danh mục sản phẩm
- **Tính năng**: Upload icon danh mục

### 4. OrderFormComponent
- **File**: `src/app/components/order-form/order-form.component.ts`
- **Chức năng**: Tạo/sửa đơn hàng
- **Tính năng**: Chọn người mua/bán, thêm nhiều sản phẩm, tính tổng tiền tự động

## Các Service

### 1. UsersService
- **File**: `src/app/services/users.service.ts`
- **Methods**: addUser, getUsers, getUsersByRole, updateUser, deleteUser

### 2. ProductsService
- **File**: `src/app/services/products.service.ts`
- **Methods**: addProduct, getProducts, getProductsBySeller, getProductsByStatus, updateProductStatus, updateProduct, deleteProduct

### 3. CategoriesService
- **File**: `src/app/services/categories.service.ts`
- **Methods**: addCategory, getCategories, updateCategory, deleteCategory

### 4. OrdersService
- **File**: `src/app/services/orders.service.ts`
- **Methods**: addOrder, getOrders, getOrdersByBuyer, getOrdersBySeller, updateOrderStatus, deleteOrder

### 5. ImageUploadService
- **File**: `src/app/services/image-upload.service.ts`
- **Methods**: uploadUserAvatar, uploadProductImage, uploadMultipleProductImages, uploadCategoryIcon, deleteImage, deleteMultipleImages

## Demo Component

### FormsDemoComponent
- **File**: `src/app/components/forms-demo/forms-demo.component.ts`
- **Chức năng**: Demo tất cả các forms với giao diện tab
- **Tính năng**: 
  - Tab quản lý người dùng
  - Tab quản lý danh mục
  - Tab quản lý sản phẩm
  - Tab quản lý đơn hàng
  - CRUD operations cho tất cả entities

## Cách sử dụng

### 1. Truy cập Demo
- Đăng nhập vào hệ thống
- Vào Dashboard
- Click nút "Demo Forms"

### 2. Quản lý Người dùng
- Thêm người dùng mới với vai trò seller/admin/customer
- Upload avatar
- Sửa/xóa người dùng

### 3. Quản lý Danh mục
- Tạo danh mục sản phẩm
- Upload icon cho danh mục
- Sửa/xóa danh mục

### 4. Quản lý Sản phẩm
- Tạo sản phẩm mới với thông tin đầy đủ
- Upload nhiều hình ảnh
- Chọn danh mục và trạng thái
- Quản lý trạng thái duyệt (pending/approved/rejected)

### 5. Quản lý Đơn hàng
- Tạo đơn hàng mới
- Chọn người mua và người bán
- Thêm nhiều sản phẩm vào đơn hàng
- Tự động tính tổng tiền
- Quản lý trạng thái đơn hàng

## Storage Structure

Hình ảnh được lưu trữ theo cấu trúc:
```
storage/
├── users/
│   └── avatars/
│       └── {userId}/
│           └── profile_{timestamp}.{ext}
├── products/
│   └── {productId}/
│       └── image_{index}_{timestamp}.{ext}
└── categories/
    └── {categoryId}/
        └── icon_{timestamp}.{ext}
```

## Tính năng nổi bật

1. **Validation**: Tất cả forms đều có validation đầy đủ
2. **Image Upload**: Hỗ trợ upload hình ảnh với preview
3. **Real-time Updates**: Dữ liệu được cập nhật real-time
4. **Error Handling**: Xử lý lỗi một cách graceful
5. **Responsive Design**: Giao diện responsive trên mọi thiết bị
6. **Type Safety**: Sử dụng TypeScript với type safety đầy đủ

## Cài đặt và Chạy

1. Đảm bảo Firebase đã được cấu hình đúng
2. Chạy `npm install` để cài đặt dependencies
3. Chạy `ng serve` để khởi động development server
4. Truy cập `http://localhost:4200` và đăng nhập
5. Vào Dashboard và click "Demo Forms" để sử dụng

## Lưu ý

- Tất cả dữ liệu được lưu trữ trên Firebase Firestore
- Hình ảnh được lưu trữ trên Firebase Storage
- Cần có quyền admin để truy cập một số tính năng
- Dữ liệu được đồng bộ real-time giữa các client
