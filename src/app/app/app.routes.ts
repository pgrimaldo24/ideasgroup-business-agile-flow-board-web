import { Routes } from '@angular/router';

import { authGuard } from '@core/infrastructure/guards/auth.guard';
import { guestGuard } from '@core/infrastructure/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('@features/projects/projects.routes').then((m) => m.projectsRoutes)
  },
  {
    path: '**',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@shared/ui/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Página no encontrada | AgileFlowBoard'
  }
];
