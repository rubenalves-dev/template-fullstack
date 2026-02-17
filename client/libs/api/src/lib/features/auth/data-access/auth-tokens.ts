import { InjectionToken } from '@angular/core';

export interface AuthCookieOptions {
  path?: string;
  domain?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}

export const AUTH_API_BASE_URL = new InjectionToken<string>('AUTH_API_BASE_URL', {
  factory: () => '',
});

export const AUTHZ_API_BASE_URL = new InjectionToken<string>('AUTHZ_API_BASE_URL', {
  factory: () => '',
});

export const AUTH_COOKIE_OPTIONS = new InjectionToken<AuthCookieOptions>('AUTH_COOKIE_OPTIONS', {
  factory: () => ({
    path: '/',
    sameSite: 'Lax',
    secure: false,
  }),
});

export const AUTH_REFRESH_BUFFER_MS = new InjectionToken<number>('AUTH_REFRESH_BUFFER_MS', {
  factory: () => 60_000,
});
