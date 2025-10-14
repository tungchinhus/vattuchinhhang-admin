# HƯỚNG DẪN TẠO ROLES VÀ GÁN PERMISSIONS

## Bước 1: Tạo Collection Roles trong Firebase Console

### Collection: roles

### Document 1: super_admin
- Document ID: super_admin
- Fields:
  - id (string): super_admin
  - name (string): super_admin
  - displayName (string): Super Admin
  - description (string): Quản trị viên cấp cao với toàn quyền
  - permissions (array): ["user_view", "user_create", "user_update", "user_delete", "role_view", "role_create", "role_update", "role_delete", "role_assign", "report_view", "report_export", "settings_view", "settings_update", "system_config"]
  - isActive (boolean): true

### Document 2: admin
- Document ID: admin
- Fields:
  - id (string): admin
  - name (string): admin
  - displayName (string): Admin
  - description (string): Quản trị viên với quyền quản lý hệ thống
  - permissions (array): ["user_view", "user_create", "user_update", "role_view", "role_create", "role_update", "role_assign", "report_view", "report_export", "settings_view", "settings_update"]
  - isActive (boolean): true

### Document 3: manager
- Document ID: manager
- Fields:
  - id (string): manager
  - name (string): manager
  - displayName (string): Manager
  - description (string): Quản lý với quyền quản lý nhân viên và dữ liệu
  - permissions (array): ["user_view", "role_view", "report_view", "report_export", "settings_view"]
  - isActive (boolean): true

### Document 4: user
- Document ID: user
- Fields:
  - id (string): user
  - name (string): user
  - displayName (string): Người dùng
  - description (string): Người dùng thông thường
  - permissions (array): ["user_view"]
  - isActive (boolean): true

### Document 5: viewer
- Document ID: viewer
- Fields:
  - id (string): viewer
  - name (string): viewer
  - displayName (string): Người xem
  - description (string): Chỉ có quyền xem dữ liệu
  - permissions (array): ["user_view", "role_view", "report_view"]
  - isActive (boolean): true

## Bước 2: Tạo Collection UserRoles để gán vai trò cho người dùng

### Collection: userRoles

### Ví dụ Document: user_role_1
- Document ID: user_role_1 (hoặc tự động)
- Fields:
  - userId (string): [ID của user]
  - roleId (string): super_admin
  - assignedAt (timestamp): [thời gian gán]
  - assignedBy (string): [email người gán]
  - isActive (boolean): true

## Cách thêm trong Firebase Console:

### 1. Tạo Collection Roles:
1. Click "Start collection"
2. Nhập tên: roles
3. Click "Next"
4. Thêm từng document theo danh sách trên

### 2. Tạo Collection UserRoles:
1. Click "Start collection"
2. Nhập tên: userRoles
3. Click "Next"
4. Thêm document với userId và roleId

### 3. Cách thêm Array trong Firebase:
- Khi thêm field "permissions"
- Chọn kiểu: Array
- Click "Add item" để thêm từng permission
- Nhập: user_view, sau đó click "Add item" để thêm tiếp

## Lưu ý:
- Array trong Firebase Console: chọn kiểu "Array" và thêm từng item
- Timestamp: chọn kiểu "Timestamp" và để Firebase tự động tạo
- Boolean: chọn kiểu "Boolean" và nhập true/false
