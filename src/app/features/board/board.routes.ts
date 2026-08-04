import { Routes } from '@angular/router';

export const boardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./board.component').then((m) => m.BoardComponent),
    title: 'Tablero | AgileFlowBoard'
  }
];
