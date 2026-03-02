import { Route } from '@angular/router';
import { authGuard } from './features/auth/data-access/auth-guard';
import { AdminLayout } from './shared/ui/layouts/admin-layout/admin-layout';

export const appRoutes: Route[] = [
    {
        path: 'admin/auth',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/components/login/login').then(
                        (m) => m.Login,
                    ),
            },
        ],
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivateChild: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import(
                        './features/home/components/dashboard/dashboard'
                    ).then((m) => m.Dashboard),
            },
        ],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin/dashboard',
    },
];
