import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-list/project-list.component').then((m) => m.ProjectListComponent),
    title: 'Proyectos | AgileFlowBoard'
  },
  {
    // El tablero cuelga del proyecto porque no existe fuera de él. `:projectId`
    // se enlaza al @Input del mismo nombre gracias a withComponentInputBinding().
    path: ':projectId/board',
    loadChildren: () => import('@features/board/board.routes').then((m) => m.boardRoutes)
  }
];
