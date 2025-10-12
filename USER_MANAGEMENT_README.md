# Chức năng Quản lý Người dùng

Tôi đã tạo thành công chức năng quản lý người dùng hoàn chỉnh với giao diện đẹp và các tính năng đầy đủ.

## 🚀 Tính năng đã được tạo

### 1. **Giao diện Quản lý Người dùng**
- **File**: `src/app/components/user-management/user-management.component.ts`
- **Route**: `/user-management`
- **Chức năng**: Giao diện quản lý người dùng đầy đủ với bảng dữ liệu

### 2. **Tính năng CRUD**
- ✅ **Thêm người dùng** - Form thêm người dùng mới với validation
- ✅ **Sửa người dùng** - Chỉnh sửa thông tin người dùng
- ✅ **Xóa người dùng** - Xóa người dùng với xác nhận
- ✅ **Xem danh sách** - Hiển thị danh sách người dùng với thông tin đầy đủ

### 3. **Tính năng Tìm kiếm và Lọc**
- 🔍 **Tìm kiếm** - Tìm kiếm theo tên hoặc email
- 🏷️ **Lọc theo vai trò** - Lọc người dùng theo vai trò (Customer/Seller/Admin)
- 🧹 **Xóa bộ lọc** - Reset tất cả bộ lọc

### 4. **Tính năng Upload Avatar**
- 📷 **Upload ảnh** - Upload ảnh đại diện cho người dùng
- 👁️ **Preview** - Xem trước ảnh trước khi lưu
- 🗑️ **Xóa ảnh** - Xóa ảnh đã upload

### 5. **Tính năng Phân trang**
- 📄 **Phân trang** - Phân trang danh sách người dùng
- 🔢 **Điều hướng** - Nút điều hướng trang trước/sau
- 📊 **Thông tin trang** - Hiển thị trang hiện tại/tổng số trang

### 6. **Giao diện Responsive**
- 📱 **Mobile-friendly** - Giao diện tối ưu cho mobile
- 💻 **Desktop** - Giao diện đẹp cho desktop
- 🎨 **Modern UI** - Thiết kế hiện đại với Material Design

## 👥 Các vai trò Người dùng

### 1. **Customer (Khách hàng)**
- Vai trò: `customer`
- Màu sắc: Xanh lá cây
- Mô tả: Người dùng mua hàng

### 2. **Seller (Người bán)**
- Vai trò: `seller`
- Màu sắc: Xanh dương
- Mô tả: Người bán sản phẩm

### 3. **Admin (Quản trị viên)**
- Vai trò: `admin`
- Màu sắc: Tím
- Mô tả: Quản trị hệ thống

## 📊 Cấu trúc Dữ liệu

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

## 🗂️ Storage Structure

```
storage/
└── users/
    └── avatars/
        └── {userId}/
            └── profile_{timestamp}.{ext}
```

## 🛠️ Services được sử dụng

### 1. **UsersService**
- `addUser()` - Thêm người dùng mới
- `getUsers()` - Lấy danh sách người dùng
- `getUsersByRole()` - Lấy người dùng theo vai trò
- `updateUser()` - Cập nhật thông tin người dùng
- `deleteUser()` - Xóa người dùng

### 2. **ImageUploadService**
- `uploadUserAvatar()` - Upload avatar người dùng
- `deleteImage()` - Xóa ảnh

## 🎯 Cách sử dụng

### 1. **Truy cập chức năng**
- Đăng nhập vào hệ thống
- Vào Dashboard
- Click nút "Quản lý Người dùng"

### 2. **Thêm người dùng**
- Click nút "Thêm người dùng"
- Điền thông tin: Tên, Email, Vai trò
- Upload avatar (tùy chọn)
- Click "Thêm"

### 3. **Sửa người dùng**
- Click nút "Sửa" trên dòng người dùng
- Chỉnh sửa thông tin
- Click "Cập nhật"

### 4. **Xóa người dùng**
- Click nút "Xóa" trên dòng người dùng
- Xác nhận xóa

### 5. **Tìm kiếm**
- Nhập từ khóa vào ô tìm kiếm
- Kết quả sẽ được lọc tự động

### 6. **Lọc theo vai trò**
- Chọn vai trò từ dropdown
- Danh sách sẽ được lọc theo vai trò

## 📱 Giao diện

### **Header**
- Tiêu đề trang
- Nút "Thêm người dùng"

### **Search & Filter**
- Ô tìm kiếm
- Dropdown lọc vai trò
- Nút "Xóa bộ lọc"

### **Table**
- Cột: Tên, Email, Vai trò, Avatar, Ngày tạo, Thao tác
- Hover effect
- Responsive design

### **Dialog**
- Form thêm/sửa người dùng
- Upload avatar với preview
- Validation đầy đủ

### **Pagination**
- Nút điều hướng
- Thông tin trang

## 🔧 Technical Details

### **Angular Features**
- Standalone Components
- Signals for reactive state
- Dependency Injection
- Form validation
- Router navigation

### **Firebase Integration**
- Firestore for data storage
- Storage for image uploads
- Authentication integration

### **UI/UX**
- Modern CSS Grid layout
- Responsive design
- Loading states
- Error handling
- User feedback

## 🚀 Demo

Truy cập `/user-demo` để xem thông tin chi tiết về chức năng đã được tạo.

## 📝 Lưu ý

- Tất cả dữ liệu được lưu trữ trên Firebase
- Cần đăng nhập để truy cập chức năng
- Avatar được lưu trên Firebase Storage
- Giao diện responsive trên mọi thiết bị
- Validation đầy đủ cho tất cả form
