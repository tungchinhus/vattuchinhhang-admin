import { Routes } from '@angular/router';

export const PRODUCT_DETAIL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'variants',
    pathMatch: 'full'
  },
  {
    path: 'variants',
    loadComponent: () => import('../variants/variants-list/variants-list.component').then(m => m.VariantsListComponent)
  },
  {
    path: 'specs',
    loadComponent: () => import('../specs/specs-list/specs-list.component').then(m => m.SpecsListComponent)
  },
  {
    path: 'attachments',
    loadComponent: () => import('../attachments/attachments-list/attachments-list.component').then(m => m.AttachmentsListComponent)
  }
];


