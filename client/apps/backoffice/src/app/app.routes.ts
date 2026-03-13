import { Route } from '@angular/router';
import { authGuard } from './features/auth/data-access/auth-guard';
import { CMS_ROUTES } from './features/cms/cms.routes';
import { HOME_ROUTES } from './features/home/home.routes';
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
        path: 'admin/page/layout/:slug',
        loadComponent: () =>
            import('./features/cms/components/page-layout/page-layout').then(
                (m) => m.PageLayout,
            ),
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
