import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./orders-list/orders-list.component').then(m => m.OrdersListComponent)
  },
  {
    path: ':orderId',
    loadComponent: () => import('./order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  }
];


