import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dang-nhap',
    pathMatch: 'full'
  },
  {
    path: 'products/new',
    loadComponent: () => import('./components/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'categories/:slug',
    loadComponent: () => import('./components/category-page/category-page.component').then(m => m.CategoryPageComponent)
  },
  // Removed duplicate and linting error entry for 'quan-ly-san-pham' route
  {
    path: 'quan-ly-san-pham',
    loadComponent: () => import('./components/quan-ly-san-pham/quan-ly-san-pham.component').then(m => m.QuanLySanPhamComponent),
    canActivate: [AuthGuard]
  },
  // Removed problematic 'quan-ly-danh-muc' route due to missing module and lint error
  // Removed problematic 'quan-ly-don-hang' route due to missing module and lint error
  {
    path: 'dang-nhap',
    loadComponent: () => import('./components/dang-nhap/dang-nhap.component').then(m => m.DangNhapComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'quan-ly-user',
    loadComponent: () => import('./components/quan-ly-user/quan-ly-user.component').then(m => m.QuanLyUserComponent),
    canActivate: [AuthGuard],
    data: { 
      roles: ['super_admin', 'admin'],
      permissions: ['user_view']
    }
  },
  {
    path: 'quan-ly-phan-quyen',
    loadComponent: () => import('./components/quan-ly-phan-quyen/quan-ly-phan-quyen.component').then(m => m.QuanLyPhanQuyenComponent),
    canActivate: [AuthGuard],
    data: { 
      roles: ['super_admin', 'admin'],
      permissions: ['role_view']
    }
  },
  {
    path: 'role-test',
    loadComponent: () => import('./components/role-test/role-test.component').then(m => m.RoleTestComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ai-demo',
    loadComponent: () => import('./components/ai-demo/ai-demo.component').then(m => m.AiDemoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ai-test',
    loadComponent: () => import('./components/ai-test/ai-test.component').then(m => m.AiTestComponent)
  },
  {
    path: 'firebase-test',
    loadComponent: () => import('./components/firebase-test/firebase-test.component').then(m => m.FirebaseTestComponent)
  },
];
