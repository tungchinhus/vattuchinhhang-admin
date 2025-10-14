# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG PHÂN QUYỀN TRONG ANGULAR

## 🎯 Tổng quan

Hệ thống phân quyền đã được tích hợp hoàn chỉnh vào Angular với các thành phần:

1. **PermissionService** - Service quản lý permissions và roles
2. **PermissionGuard** - Guard bảo vệ routes
3. **HasPermissionDirective** - Directive hiển thị/ẩn UI theo permission
4. **HasRoleDirective** - Directive hiển thị/ẩn UI theo role

## 📁 Files đã tạo:

- `src/app/services/permission.service.ts` - Service chính
- `src/app/guards/permission.guard.ts` - Route guard
- `src/app/directives/has-permission.directive.ts` - Permission directive
- `src/app/directives/has-role.directive.ts` - Role directive
- `src/app/components/unauthorized/unauthorized.component.ts` - Trang lỗi
- `src/app/components/permission-demo/permission-demo.component.ts` - Demo component

## 🔧 Cách sử dụng:

### 1. Import vào App Module hoặc Component

```typescript
// Trong app.config.ts hoặc component
import { PermissionService } from './services/permission.service';
import { PermissionGuard } from './guards/permission.guard';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { HasRoleDirective } from './directives/has-role.directive';
```

### 2. Sử dụng trong Routes

```typescript
// app.routes.ts
{
  path: 'quan-ly-user',
  loadComponent: () => import('./components/quan-ly-user/quan-ly-user.component'),
  canActivate: [AuthGuard, PermissionGuard],
  data: { 
    permissions: ['user_view'] // Yêu cầu quyền user_view
  }
}

// Hoặc yêu cầu role
{
  path: 'admin-panel',
  loadComponent: () => import('./components/admin-panel/admin-panel.component'),
  canActivate: [AuthGuard, PermissionGuard],
  data: { 
    roles: ['admin', 'super_admin'] // Yêu cầu role admin hoặc super_admin
  }
}

// Yêu cầu nhiều permissions (ANY)
{
  path: 'reports',
  loadComponent: () => import('./components/reports/reports.component'),
  canActivate: [AuthGuard, PermissionGuard],
  data: { 
    permissions: ['report_view', 'report_export'] // Có ít nhất 1 trong 2 quyền
  }
}

// Yêu cầu nhiều permissions (ALL)
{
  path: 'system-config',
  loadComponent: () => import('./components/system-config/system-config.component'),
  canActivate: [AuthGuard, PermissionGuard],
  data: { 
    permissions: ['settings_view', 'system_config'],
    requireAll: true // Phải có TẤT CẢ quyền
  }
}
```

### 3. Sử dụng trong Template (HTML)

```html
<!-- Hiển thị nếu có quyền user_view -->
<div *appHasPermission="'user_view'">
  <button>Xem danh sách user</button>
</div>

<!-- Hiển thị nếu có quyền user_create -->
<div *appHasPermission="'user_create'">
  <button>Tạo user mới</button>
</div>

<!-- Hiển thị nếu có bất kỳ quyền nào trong danh sách -->
<div *appHasPermission="['user_view', 'user_create', 'user_update']">
  <button>Quản lý user</button>
</div>

<!-- Hiển thị nếu có TẤT CẢ quyền -->
<div *appHasPermission="['settings_view', 'system_config']" 
     appHasPermissionRequireAll="true">
  <button>Cấu hình hệ thống</button>
</div>

<!-- Hiển thị nếu có role admin -->
<div *appHasRole="'admin'">
  <button>Admin Panel</button>
</div>

<!-- Hiển thị nếu có role admin hoặc super_admin -->
<div *appHasRole="['admin', 'super_admin']">
  <button>Quản trị</button>
</div>
```

### 4. Sử dụng trong Component (TypeScript)

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="canCreateUser$ | async">
      <button (click)="createUser()">Tạo User</button>
    </div>
    
    <div *ngIf="isAdmin$ | async">
      <button (click)="adminAction()">Admin Action</button>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  canCreateUser$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  userRoles$: Observable<string[]>;
  userPermissions$: Observable<string[]>;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    // Kiểm tra quyền cụ thể
    this.canCreateUser$ = this.permissionService.hasPermission('user_create');
    
    // Kiểm tra role
    this.isAdmin$ = this.permissionService.isAdmin();
    
    // Lấy danh sách roles và permissions của user hiện tại
    this.userRoles$ = this.permissionService.getCurrentUserRoles();
    this.userPermissions$ = this.permissionService.getCurrentUserPermissions();
  }

  createUser(): void {
    // Logic tạo user
  }

  adminAction(): void {
    // Logic admin
  }
}
```

### 5. Các Methods có sẵn trong PermissionService

```typescript
// Kiểm tra quyền
hasPermission(permissionId: string): Observable<boolean>
hasAnyPermission(permissionIds: string[]): Observable<boolean>

// Kiểm tra role
hasRole(roleId: string): Observable<boolean>
hasAnyRole(roleIds: string[]): Observable<boolean>

// Kiểm tra role đặc biệt
isSuperAdmin(): Observable<boolean>
isAdmin(): Observable<boolean>

// Lấy thông tin user hiện tại
getCurrentUserRoles(): Observable<string[]>
getCurrentUserPermissions(): Observable<string[]>

// Lấy display name
getPermissionDisplayName(permissionId: string): string
getRoleDisplayName(roleId: string): string

// Refresh data
refreshData(): void
```

## 🎨 Ví dụ thực tế:

### Trong QuanLyUserComponent:

```html
<!-- Chỉ hiển thị nút "Tạo mới" nếu có quyền user_create -->
<button mat-raised-button 
        color="primary" 
        *appHasPermission="'user_create'"
        (click)="openCreateDialog()">
  <mat-icon>add</mat-icon>
  Tạo User
</button>

<!-- Chỉ hiển thị nút "Xóa" nếu có quyền user_delete -->
<button mat-icon-button 
        color="warn" 
        *appHasPermission="'user_delete'"
        (click)="deleteUser(user)">
  <mat-icon>delete</mat-icon>
</button>

<!-- Chỉ hiển thị cột "Actions" nếu có quyền chỉnh sửa -->
<ng-container matColumnDef="actions" *appHasPermission="['user_update', 'user_delete']">
  <th mat-header-cell *matHeaderCellDef>Thao tác</th>
  <td mat-cell *matCellDef="let user">
    <button mat-icon-button *appHasPermission="'user_update'" (click)="editUser(user)">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button *appHasPermission="'user_delete'" (click)="deleteUser(user)">
      <mat-icon>delete</mat-icon>
    </button>
  </td>
</ng-container>
```

## 🚀 Lợi ích:

1. **Bảo mật**: Routes và UI được bảo vệ theo quyền
2. **Linh hoạt**: Dễ dàng thay đổi quyền mà không cần sửa code
3. **Tái sử dụng**: Directives có thể dùng ở bất kỳ đâu
4. **Hiệu suất**: Chỉ load data khi cần thiết
5. **Dễ bảo trì**: Logic phân quyền tập trung trong service

## ⚠️ Lưu ý:

1. **Import directives**: Nhớ import directives vào component hoặc module
2. **Async pipe**: Luôn sử dụng async pipe với Observable
3. **Error handling**: Xử lý lỗi khi không có quyền
4. **Performance**: Tránh gọi service quá nhiều lần
5. **Testing**: Test các trường hợp có/không có quyền
