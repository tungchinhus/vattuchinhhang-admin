# HƯỚNG DẪN IMPORT PERMISSIONS VÀO FIREBASE CONSOLE

## Collection: permissions

### Document 1: user_view
- Document ID: user_view
- Fields:
  - id (string): user_view
  - name (string): user_view
  - displayName (string): Xem người dùng
  - description (string): Xem danh sách người dùng
  - module (string): quan_ly_user
  - action (string): view
  - isActive (boolean): true

### Document 2: user_create
- Document ID: user_create
- Fields:
  - id (string): user_create
  - name (string): user_create
  - displayName (string): Tạo người dùng
  - description (string): Tạo mới người dùng
  - module (string): quan_ly_user
  - action (string): create
  - isActive (boolean): true

### Document 3: user_update
- Document ID: user_update
- Fields:
  - id (string): user_update
  - name (string): user_update
  - displayName (string): Cập nhật người dùng
  - description (string): Chỉnh sửa thông tin người dùng
  - module (string): quan_ly_user
  - action (string): update
  - isActive (boolean): true

### Document 4: user_delete
- Document ID: user_delete
- Fields:
  - id (string): user_delete
  - name (string): user_delete
  - displayName (string): Xóa người dùng
  - description (string): Xóa người dùng
  - module (string): quan_ly_user
  - action (string): delete
  - isActive (boolean): true

### Document 5: role_view
- Document ID: role_view
- Fields:
  - id (string): role_view
  - name (string): role_view
  - displayName (string): Xem vai trò
  - description (string): Xem danh sách vai trò
  - module (string): quan_ly_phan_quyen
  - action (string): view
  - isActive (boolean): true

### Document 6: role_create
- Document ID: role_create
- Fields:
  - id (string): role_create
  - name (string): role_create
  - displayName (string): Tạo vai trò
  - description (string): Tạo mới vai trò
  - module (string): quan_ly_phan_quyen
  - action (string): create
  - isActive (boolean): true

### Document 7: role_update
- Document ID: role_update
- Fields:
  - id (string): role_update
  - name (string): role_update
  - displayName (string): Cập nhật vai trò
  - description (string): Chỉnh sửa thông tin vai trò
  - module (string): quan_ly_phan_quyen
  - action (string): update
  - isActive (boolean): true

### Document 8: role_delete
- Document ID: role_delete
- Fields:
  - id (string): role_delete
  - name (string): role_delete
  - displayName (string): Xóa vai trò
  - description (string): Xóa vai trò
  - module (string): quan_ly_phan_quyen
  - action (string): delete
  - isActive (boolean): true

### Document 9: role_assign
- Document ID: role_assign
- Fields:
  - id (string): role_assign
  - name (string): role_assign
  - displayName (string): Gán vai trò
  - description (string): Gán vai trò cho người dùng
  - module (string): quan_ly_phan_quyen
  - action (string): assign
  - isActive (boolean): true

### Document 10: report_view
- Document ID: report_view
- Fields:
  - id (string): report_view
  - name (string): report_view
  - displayName (string): Xem báo cáo
  - description (string): Xem các báo cáo
  - module (string): bao_cao
  - action (string): view
  - isActive (boolean): true

### Document 11: report_export
- Document ID: report_export
- Fields:
  - id (string): report_export
  - name (string): report_export
  - displayName (string): Xuất báo cáo
  - description (string): Xuất báo cáo
  - module (string): bao_cao
  - action (string): export
  - isActive (boolean): true

### Document 12: settings_view
- Document ID: settings_view
- Fields:
  - id (string): settings_view
  - name (string): settings_view
  - displayName (string): Xem cài đặt
  - description (string): Xem cài đặt hệ thống
  - module (string): cai_dat
  - action (string): view
  - isActive (boolean): true

### Document 13: settings_update
- Document ID: settings_update
- Fields:
  - id (string): settings_update
  - name (string): settings_update
  - displayName (string): Cập nhật cài đặt
  - description (string): Chỉnh sửa cài đặt hệ thống
  - module (string): cai_dat
  - action (string): update
  - isActive (boolean): true

### Document 14: system_config
- Document ID: system_config
- Fields:
  - id (string): system_config
  - name (string): system_config
  - displayName (string): Cấu hình hệ thống
  - description (string): Cấu hình hệ thống
  - module (string): cai_dat
  - action (string): config
  - isActive (boolean): true

## CÁCH THÊM NHANH:

1. Click "Add document" trong collection permissions
2. Nhập Document ID (ví dụ: user_view)
3. Click "Save"
4. Click vào document vừa tạo
5. Click "Add field" và thêm từng field theo danh sách trên
6. Lặp lại cho tất cả 14 documents

## LƯU Ý:
- Kiểu dữ liệu: string cho text, boolean cho true/false
- Document ID phải chính xác (không có khoảng trắng)
- Tất cả giá trị isActive đều là true
