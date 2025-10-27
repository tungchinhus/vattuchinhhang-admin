import { Routes } from '@angular/router';

export const COMBOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./combos-list/combos-list.component').then(m => m.CombosListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./combo-form/combo-form.component').then(m => m.ComboFormComponent)
  },
  {
    path: ':comboId',
    loadComponent: () => import('./combo-form/combo-form.component').then(m => m.ComboFormComponent)
  }
];


