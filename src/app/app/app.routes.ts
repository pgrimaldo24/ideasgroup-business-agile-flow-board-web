import { Routes } from '@angular/router';

/**
 * Rutas raíz de la aplicación.
 *
 * Cada feature se carga de forma diferida (`loadChildren`) y expone su propio
 * archivo de rutas, de modo que agregar o quitar una feature no obliga a tocar
 * este archivo más allá de una línea.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects'
  },
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    // TODO(layout): envolver con AppLayoutComponent al integrar la plantilla Sakai.
    // TODO(auth): proteger con el guard de sesión de core/infrastructure/guards.
    path: 'projects',
    loadChildren: () => import('@features/projects/projects.routes').then((m) => m.projectsRoutes)
  },
  {
    path: '**',
    loadComponent: () =>
      import('@shared/ui/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Página no encontrada | AgileFlowBoard'
  }
];
