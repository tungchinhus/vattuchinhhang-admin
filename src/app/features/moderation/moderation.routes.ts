import { Routes } from '@angular/router';

export const MODERATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./moderation-queue/moderation-queue.component').then(m => m.ModerationQueueComponent)
  }
];


