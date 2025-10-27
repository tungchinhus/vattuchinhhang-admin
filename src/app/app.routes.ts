import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dang-nhap',
    pathMatch: 'full'
  },
  {
    path: 'combos',
    loadChildren: () => import('./features/combos/combos.routes').then(m => m.COMBOS_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin', 'seller'] }
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES),
    canActivate: [AuthGuard]
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
    canActivate: [AuthGuard]
  },
  {
    path: 'quan-ly-phan-quyen',
    loadComponent: () => import('./components/quan-ly-phan-quyen/quan-ly-phan-quyen.component').then(m => m.QuanLyPhanQuyenComponent),
    canActivate: [AuthGuard]
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
  // permission-test route removed because the component was deleted
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin'] }
  },
  {
    path: 'sellers',
    loadChildren: () => import('./features/sellers/sellers.routes').then(m => m.SELLERS_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin', 'seller'] }
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then(m => m.ORDERS_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin', 'seller', 'buyer'] }
  },
  {
    path: 'moderation',
    loadChildren: () => import('./features/moderation/moderation.routes').then(m => m.MODERATION_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin'] }
  },
  {
    path: 'brands',
    loadChildren: () => import('./features/brands/brands.routes').then(m => m.BRANDS_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin'] }
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories.routes').then(m => m.CATEGORIES_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin'] }
  },
  {
    path: 'reviews',
    loadChildren: () => import('./features/reviews/reviews.routes').then(m => m.REVIEWS_ROUTES),
    canActivate: [AuthGuard],
    data: { roles: ['super_admin', 'admin', 'seller', 'buyer'] }
  }
];
