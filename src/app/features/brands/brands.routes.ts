import { Routes } from '@angular/router';

export const BRANDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./brands-list/brands-list.component').then(m => m.BrandsListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./brand-form/brand-form.component').then(m => m.BrandFormComponent)
  },
  {
    path: ':brandId',
    loadComponent: () => import('./brand-form/brand-form.component').then(m => m.BrandFormComponent)
  }
];


