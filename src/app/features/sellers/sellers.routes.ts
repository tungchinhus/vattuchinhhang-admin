import { Routes } from '@angular/router';

export const SELLERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sellers-list/sellers-list.component').then(m => m.SellersListComponent)
  },
  {
    path: ':sellerId',
    loadComponent: () => import('./seller-detail/seller-detail.component').then(m => m.SellerDetailComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products'
      },
      {
        path: 'products',
        loadComponent: () => import('./tabs/products/products-list/products-list.component').then(m => m.ProductsListComponent)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./tabs/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/:productId',
        loadComponent: () => import('./tabs/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'variants'
          },
          {
            path: 'variants',
            loadComponent: () => import('./tabs/products/variants/variants-list/variants-list.component').then(m => m.VariantsListComponent)
          },
          {
            path: 'specs',
            loadComponent: () => import('./tabs/products/specs/specs-list/specs-list.component').then(m => m.SpecsListComponent)
          },
          {
            path: 'attachments',
            loadComponent: () => import('./tabs/products/attachments/attachments-list/attachments-list.component').then(m => m.AttachmentsListComponent)
          }
        ]
      },
      {
        path: 'warehouses',
        loadComponent: () => import('./tabs/warehouses/warehouses-list/warehouses-list.component').then(m => m.WarehousesListComponent)
      }
    ]
  }
];


