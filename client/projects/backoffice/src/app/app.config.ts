import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  AUTH_API_BASE_URL,
  AUTH_COOKIE_OPTIONS,
  AUTH_REFRESH_BUFFER_MS,
  AUTHZ_API_BASE_URL,
} from 'lib';
import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';

const authApiBaseUrl = 'http://localhost:8080';
const authzApiBaseUrl = 'http://localhost:8080';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
  ],
};
