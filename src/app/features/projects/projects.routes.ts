import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-list/project-list.component').then((m) => m.ProjectListComponent),
    title: 'Proyectos | AgileFlowBoard'
  },
  {
    path: ':projectId/board',
    loadChildren: () => import('@features/board/board.routes').then((m) => m.boardRoutes)
  }
];
