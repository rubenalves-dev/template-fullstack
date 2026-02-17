import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { AUTH_COOKIE_OPTIONS, AuthCookieOptions } from './auth-tokens';
import { AuthSession } from './dtos';

@Injectable({
  providedIn: 'root',
})
export class TokenStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly cookieOptions = inject(AUTH_COOKIE_OPTIONS);

  getAccessToken(): string | null {
    return this.getCookieValue('access_token');
  }

  getAccessExpiresAt(): string | null {
    return this.getCookieValue('access_expires_at');
  }

  getRefreshToken(): string | null {
    return this.getCookieValue('refresh_token');
  }

  setSession(session: AuthSession): void {
    if (!this.isBrowser) {
      return;
    }

    this.setCookie('access_token', session.accessToken, session.accessExpiresAt);
    this.setCookie('access_expires_at', session.accessExpiresAt, session.accessExpiresAt);

    if (session.refreshToken) {
      this.setCookie('refresh_token', session.refreshToken, session.refreshExpiresAt);
    }
  }

  clearSession(): void {
    if (!this.isBrowser) {
      return;
    }

    this.clearCookie('access_token');
    this.clearCookie('access_expires_at');
  }

  private getCookieValue(name: string): string | null {
    if (!this.isBrowser) {
      return null;
    }

    const cookies = document.cookie.split(';');
    const target = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));

    if (!target) {
      return null;
    }

    return decodeURIComponent(target.split('=')[1] ?? '');
  }

  private setCookie(name: string, value: string, expiresAt?: string): void {
    const options = this.buildCookieOptions(expiresAt);
    document.cookie = `${name}=${encodeURIComponent(value)}${options}`;
  }

  private clearCookie(name: string): void {
    const options = this.buildCookieOptions('1970-01-01T00:00:00.000Z');
    document.cookie = `${name}=;${options}`;
  }

  private buildCookieOptions(expiresAt?: string): string {
    const options: AuthCookieOptions = this.cookieOptions;
    const parts: string[] = [];

    if (expiresAt) {
      const expiresDate = new Date(expiresAt);
      if (!Number.isNaN(expiresDate.getTime())) {
        parts.push(`Expires=${expiresDate.toUTCString()}`);
      }
    }

    parts.push(`Path=${options.path ?? '/'}`);

    if (options.domain) {
      parts.push(`Domain=${options.domain}`);
    }

    if (options.sameSite) {
      parts.push(`SameSite=${options.sameSite}`);
    }

    if (options.secure) {
      parts.push('Secure');
    }

    return `; ${parts.join('; ')}`;
  }
}
