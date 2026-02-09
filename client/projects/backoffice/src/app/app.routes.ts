import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'admin/auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./features/auth/register/register').then((m) => m.Register),
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full',
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/ui/layout/layout').then((m) => m.Layout),
        children: [
            // {
            //     path: 'cms/pages',
            //     canActivate: [permissionGuard],
            //     data: { permissions: 'cms.page.read' },
            //     loadComponent: () => import('./features/cms/page/page').then((m) => m.CmsPage),
            // },
        ],
    },
];
