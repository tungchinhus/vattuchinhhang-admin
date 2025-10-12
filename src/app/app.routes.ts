import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dang-nhap',
    pathMatch: 'full'
  },
  {
    path: 'dang-nhap',
    loadComponent: () => import('./components/dang-nhap/dang-nhap.component').then(m => m.DangNhapComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'san-pham',
    loadComponent: () => import('./components/san-pham/san-pham.component').then(m => m.SanPhamComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'don-hang',
    loadComponent: () => import('./components/don-hang/don-hang.component').then(m => m.DonHangComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'khach-hang',
    loadComponent: () => import('./components/khach-hang/khach-hang.component').then(m => m.KhachHangComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'nha-cung-cap',
    loadComponent: () => import('./components/nha-cung-cap/nha-cung-cap.component').then(m => m.NhaCungCapComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'bao-cao',
    loadComponent: () => import('./components/bao-cao/bao-cao.component').then(m => m.BaoCaoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth-test',
    loadComponent: () => import('./components/auth-test/auth-test.component').then(m => m.AuthTestComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-setup',
    loadComponent: () => import('./components/admin-setup/admin-setup.component').then(m => m.AdminSetupComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth-debug',
    loadComponent: () => import('./components/auth-debug/auth-debug.component').then(m => m.AuthDebugComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'force-create-user',
    loadComponent: () => import('./components/force-create-user/force-create-user.component').then(m => m.ForceCreateUserComponent)
  },
  {
    path: 'simple-debug',
    loadComponent: () => import('./components/simple-debug/simple-debug.component').then(m => m.SimpleDebugComponent)
  },
  {
    path: 'login-debug',
    loadComponent: () => import('./components/login-debug/login-debug.component').then(m => m.LoginDebugComponent)
  },
  {
    path: 'user-demo',
    loadComponent: () => import('./components/user-demo/user-demo.component').then(m => m.UserDemoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'role-persistence-test',
    loadComponent: () => import('./components/role-persistence-test/role-persistence-test.component').then(m => m.RolePersistenceTestComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'role-management',
    loadComponent: () => import('./components/role-management/role-management.component').then(m => m.RoleManagementComponent),
    canActivate: [AuthGuard]
  },
];