import { Routes } from '@angular/router';

import { authGuard } from '@core/infrastructure/guards/auth.guard';
import { guestGuard } from '@core/infrastructure/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('@layout/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'projects'
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('@features/projects/projects.routes').then((m) => m.projectsRoutes)
      },
      {
        path: '**',
        loadComponent: () =>
          import('@shared/ui/not-found/not-found.component').then((m) => m.NotFoundComponent),
        title: 'Página no encontrada | AgileFlowBoard'
      }
    ]
  }
];
