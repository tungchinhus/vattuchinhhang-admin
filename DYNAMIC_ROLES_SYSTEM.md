# Hệ thống Quản lý Vai trò Động

## Tổng quan

Hệ thống đã được refactor để loại bỏ hardcode và implement quản lý vai trò động. Thay vì hardcode email `tungchinhus@gmail.com` làm super admin, hệ thống bây giờ sử dụng:

1. **Firebase Custom Claims** (ưu tiên cao nhất)
2. **RolesService** với collection `role_assignments` 
3. **UsersService** với collection `users` (fallback)

## Các thay đổi chính

### 1. AuthService (`src/app/services/auth.service.ts`)
- ✅ Loại bỏ `SUPER_ADMIN_EMAIL` hardcode
- ✅ Implement `getUserRole()` async để lấy role động
- ✅ Hỗ trợ Firebase Custom Claims
- ✅ Fallback hierarchy: Custom Claims → RolesService → UsersService → Default

### 2. RolesService (`src/app/services/roles.service.ts`)
- ✅ Service mới để quản lý roles động
- ✅ Collection `role_assignments` để lưu phân quyền
- ✅ Collection `role_change_requests` để quản lý yêu cầu thay đổi role
- ✅ Methods: assignRole, removeRole, approveRequest, rejectRequest, getRoleStatistics

### 3. RoleManagementComponent (`src/app/components/role-management/`)
- ✅ UI để quản lý roles động
- ✅ Thống kê roles
- ✅ Gán/xóa roles
- ✅ Phê duyệt/từ chối yêu cầu thay đổi role
- ✅ Truy cập qua `/role-management`

### 4. Firestore Rules (`firestore.rules`)
- ✅ Helper functions: `getUserRole()`, `hasRole()`, `isAdmin()`, `isSuperAdmin()`
- ✅ Rules cho `role_assignments` và `role_change_requests`
- ✅ Cập nhật rules cho các collection khác sử dụng helper functions

### 5. Routes (`src/app/app.routes.ts`)
- ✅ Thêm route `/role-management`

### 6. Dashboard (`src/app/components/dashboard/`)
- ✅ Thêm button "Quản lý Vai trò"

## Cách sử dụng

### 1. Truy cập Role Management
- Đăng nhập với tài khoản có quyền admin/super_admin
- Vào Dashboard → Click "Quản lý Vai trò"
- Hoặc truy cập trực tiếp `/role-management`

### 2. Gán vai trò mới
- Nhập email người dùng
- Chọn vai trò từ dropdown
- Nhập lý do (tùy chọn)
- Click "Gán vai trò"

### 3. Xóa vai trò
- Trong bảng "Phân quyền người dùng"
- Click icon delete (🗑️) bên cạnh người dùng
- Xác nhận xóa

### 4. Phê duyệt yêu cầu thay đổi vai trò
- Trong bảng "Yêu cầu thay đổi vai trò"
- Click ✓ để phê duyệt hoặc ✗ để từ chối
- Xác nhận hành động

## Cấu trúc Database

### Collection: `role_assignments`
```typescript
{
  id: string;
  userId: string;
  email: string;
  role: UserRole;
  assignedBy: string;
  assignedAt: Date;
  reason?: string;
}
```

### Collection: `role_change_requests`
```typescript
{
  id: string;
  userId: string;
  email: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}
```

## Quyền truy cập

### Role Management UI
- **Super Admin**: Toàn quyền (gán/xóa/phê duyệt)
- **Admin**: Chỉ xem được
- **Seller/Customer**: Không truy cập được

### Firestore Rules
- **role_assignments**: Chỉ super admin có thể tạo/sửa/xóa
- **role_change_requests**: User tạo request, super admin phê duyệt/từ chối
- **users**: Fallback cho roles cũ

## Deploy

### 1. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

Hoặc chạy file batch:
```bash
deploy-rules.bat
```

### 2. Deploy App
```bash
ng build
firebase deploy --only hosting
```

## Migration từ hệ thống cũ

### 1. Tạo Super Admin đầu tiên
- Đăng nhập với email `tungchinhus@gmail.com`
- Vào Role Management
- Gán role `super_admin` cho chính mình
- Sau đó có thể gán roles cho người khác

### 2. Migrate roles hiện có
- Các roles trong collection `users` vẫn hoạt động như fallback
- Có thể migrate dần sang `role_assignments` để có quyền kiểm soát tốt hơn

## Lợi ích

1. **Linh hoạt**: Không cần hardcode email
2. **Scalable**: Có thể có nhiều super admin
3. **Audit**: Theo dõi được ai gán role cho ai, khi nào
4. **Workflow**: Có hệ thống yêu cầu thay đổi role
5. **Security**: Firestore rules bảo vệ dữ liệu
6. **UI/UX**: Interface thân thiện để quản lý

## Troubleshooting

### Lỗi "Permission denied"
- Kiểm tra Firestore rules đã deploy chưa
- Kiểm tra user có đúng role không
- Kiểm tra Firebase Custom Claims

### Role không cập nhật
- Refresh page hoặc logout/login lại
- Kiểm tra console logs trong AuthService
- Kiểm tra Firestore có data không

### UI không load
- Kiểm tra import RolesService trong AuthService
- Kiểm tra route đã thêm chưa
- Kiểm tra Material modules đã import đủ chưa
