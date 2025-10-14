// Script để import permissions nhanh vào Firebase
// Chạy trong browser console khi đã đăng nhập Firebase

const permissions = [
  {
    id: 'user_view',
    name: 'user_view',
    displayName: 'Xem người dùng',
    description: 'Xem danh sách người dùng',
    module: 'quan_ly_user',
    action: 'view',
    isActive: true
  },
  {
    id: 'user_create',
    name: 'user_create',
    displayName: 'Tạo người dùng',
    description: 'Tạo mới người dùng',
    module: 'quan_ly_user',
    action: 'create',
    isActive: true
  },
  {
    id: 'user_update',
    name: 'user_update',
    displayName: 'Cập nhật người dùng',
    description: 'Chỉnh sửa thông tin người dùng',
    module: 'quan_ly_user',
    action: 'update',
    isActive: true
  },
  {
    id: 'user_delete',
    name: 'user_delete',
    displayName: 'Xóa người dùng',
    description: 'Xóa người dùng',
    module: 'quan_ly_user',
    action: 'delete',
    isActive: true
  },
  {
    id: 'role_view',
    name: 'role_view',
    displayName: 'Xem vai trò',
    description: 'Xem danh sách vai trò',
    module: 'quan_ly_phan_quyen',
    action: 'view',
    isActive: true
  },
  {
    id: 'role_create',
    name: 'role_create',
    displayName: 'Tạo vai trò',
    description: 'Tạo mới vai trò',
    module: 'quan_ly_phan_quyen',
    action: 'create',
    isActive: true
  },
  {
    id: 'role_update',
    name: 'role_update',
    displayName: 'Cập nhật vai trò',
    description: 'Chỉnh sửa thông tin vai trò',
    module: 'quan_ly_phan_quyen',
    action: 'update',
    isActive: true
  },
  {
    id: 'role_delete',
    name: 'role_delete',
    displayName: 'Xóa vai trò',
    description: 'Xóa vai trò',
    module: 'quan_ly_phan_quyen',
    action: 'delete',
    isActive: true
  },
  {
    id: 'role_assign',
    name: 'role_assign',
    displayName: 'Gán vai trò',
    description: 'Gán vai trò cho người dùng',
    module: 'quan_ly_phan_quyen',
    action: 'assign',
    isActive: true
  },
  {
    id: 'report_view',
    name: 'report_view',
    displayName: 'Xem báo cáo',
    description: 'Xem các báo cáo',
    module: 'bao_cao',
    action: 'view',
    isActive: true
  },
  {
    id: 'report_export',
    name: 'report_export',
    displayName: 'Xuất báo cáo',
    description: 'Xuất báo cáo',
    module: 'bao_cao',
    action: 'export',
    isActive: true
  },
  {
    id: 'settings_view',
    name: 'settings_view',
    displayName: 'Xem cài đặt',
    description: 'Xem cài đặt hệ thống',
    module: 'cai_dat',
    action: 'view',
    isActive: true
  },
  {
    id: 'settings_update',
    name: 'settings_update',
    displayName: 'Cập nhật cài đặt',
    description: 'Chỉnh sửa cài đặt hệ thống',
    module: 'cai_dat',
    action: 'update',
    isActive: true
  },
  {
    id: 'system_config',
    name: 'system_config',
    displayName: 'Cấu hình hệ thống',
    description: 'Cấu hình hệ thống',
    module: 'cai_dat',
    action: 'config',
    isActive: true
  }
];

console.log('🚀 Bắt đầu import permissions...');

// Import từng permission
permissions.forEach(async (permission) => {
  try {
    await firebase.firestore().collection('permissions').doc(permission.id).set(permission);
    console.log(`✅ Đã import: ${permission.displayName}`);
  } catch (error) {
    console.error(`❌ Lỗi import ${permission.id}:`, error);
  }
});

console.log('🎉 Hoàn thành import permissions!');
