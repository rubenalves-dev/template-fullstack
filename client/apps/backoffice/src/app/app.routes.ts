import { Route } from '@angular/router';
import { authGuard } from './features/auth/data-access/auth-guard';
import { AdminLayout } from './shared/ui/layouts/admin-layout/admin-layout';
import { HOME_ROUTES } from './features/home/home.routes';
import { CMS_ROUTES } from './features/cms/cms.routes';

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
        children: [...HOME_ROUTES, CMS_ROUTES],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin/dashboard',
    },
    {
        path: '**',
        redirectTo: 'admin/dashboard', // TODO: CREATE 404 PAGE
    },
];
