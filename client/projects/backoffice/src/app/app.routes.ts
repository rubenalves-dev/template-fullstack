import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth-guard';
import {permissionGuard} from './core/guards/permission-guard';

export const routes: Routes = [
  {
    path: 'admin/auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/ui/layout/layout').then(m => m.Layout),
    children: [
      // {
      //   path: 'pages',
      //   canActivate: [permissionGuard],
      //   data: {permissions: 'cms.page.read'},
      // }
    ]
  }
];
