import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./components/dashboard/dashboard').then((m) => m.Dashboard),
    },
];
