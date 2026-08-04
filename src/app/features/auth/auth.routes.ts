import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    title: 'Iniciar sesión | AgileFlowBoard'
  }
];
