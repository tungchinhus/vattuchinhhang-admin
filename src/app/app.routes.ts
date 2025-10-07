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
    path: 'quan-ly-user',
    loadComponent: () => import('./components/quan-ly-user/quan-ly-user.component').then(m => m.QuanLyUserComponent),
    canActivate: [AuthGuard],
    data: { 
      roles: ['admin', 'super_admin'],
      permissions: ['user_view']
    }
  }
];