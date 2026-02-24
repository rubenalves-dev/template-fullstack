import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    AUTH_API_BASE_URL,
    AUTH_COOKIE_OPTIONS,
    AUTH_REFRESH_BUFFER_MS,
    AUTHZ_API_BASE_URL,
} from '@template-fullstack-client/api';
import { authInterceptor } from './auth.interceptor';
import { SessionService } from './features/auth/data-access/session-service';

const authApiBaseUrl = 'https://localhost:8080';
const authzApiBaseUrl = 'https://localhost:8080';

export const appConfig: ApplicationConfig = {
    providers: [
        // providePrimeNG({
        //     theme: {
        //         preset: Material,
        //     },
        // }),
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes),
        provideHttpClient(withInterceptors([authInterceptor])),
        {
            provide: AUTH_API_BASE_URL,
            useValue: authApiBaseUrl,
        },
        {
            provide: AUTHZ_API_BASE_URL,
            useValue: authzApiBaseUrl,
        },
        {
            provide: AUTH_COOKIE_OPTIONS,
            useValue: {
                path: '/',
                sameSite: 'Lax',
                secure: false,
            },
        },
        {
            provide: AUTH_REFRESH_BUFFER_MS,
            useValue: 60_000,
        },
        provideAppInitializer(() => {
            const sessionService = inject(SessionService);
            return sessionService.initialize();
        }),
    ],
};
