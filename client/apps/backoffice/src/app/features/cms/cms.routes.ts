import { Route } from '@angular/router';

export const CMS_ROUTES: Route = {
    path: 'cms',
    children: [
        {
            path: 'pages',
            loadComponent: () =>
                import('./components/pages/pages').then((m) => m.Pages),
        },
    ],
};
