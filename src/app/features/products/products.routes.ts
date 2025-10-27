import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./products-list/products-list.component').then(m => m.ProductsListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: ':productId',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  }
];


