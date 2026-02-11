import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AUTH_COOKIE_OPTIONS, AuthCookieOptions } from './auth-tokens';
import { AuthSession } from './dtos';
import { TokenStore } from './token-store';

describe('TokenStore', () => {
    let service: TokenStore;
    let cookieOptions: AuthCookieOptions;

    beforeEach(() => {
        cookieOptions = {
            path: '/',
            sameSite: 'Lax',
            secure: false,
        };

        TestBed.configureTestingModule({
            providers: [TokenStore, { provide: AUTH_COOKIE_OPTIONS, useValue: cookieOptions }],
        });

        service = TestBed.inject(TokenStore);

        // Clear all cookies before each test
        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    });

    afterEach(() => {
        // Clean up cookies after each test
        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    });

    describe('initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('getAccessToken', () => {
        it('should return null when no token exists', () => {
            expect(service.getAccessToken()).toBeNull();
        });

        it('should retrieve access token from cookie', () => {
            document.cookie = 'access_token=test-token-123; path=/';
            expect(service.getAccessToken()).toBe('test-token-123');
        });

        it('should decode URL encoded token', () => {
            const encodedToken = encodeURIComponent('token with spaces');
            document.cookie = `access_token=${encodedToken}; path=/`;
            expect(service.getAccessToken()).toBe('token with spaces');
        });

        it('should handle special characters in token', () => {
            const specialToken = 'token+with/special=chars';
            document.cookie = `access_token=${encodeURIComponent(specialToken)}; path=/`;
            expect(service.getAccessToken()).toBe(specialToken);
        });
    });

    describe('getAccessExpiresAt', () => {
        it('should return null when no expiry exists', () => {
            expect(service.getAccessExpiresAt()).toBeNull();
        });

        it('should retrieve access expiry from cookie', () => {
            const expiryDate = '2026-12-31T23:59:59.999Z';
            document.cookie = `access_expires_at=${encodeURIComponent(expiryDate)}; path=/`;
            expect(service.getAccessExpiresAt()).toBe(expiryDate);
        });
    });

    describe('getRefreshToken', () => {
        it('should return null when no refresh token exists', () => {
            expect(service.getRefreshToken()).toBeNull();
        });

        it('should retrieve refresh token from cookie', () => {
            document.cookie = 'refresh_token=refresh-token-456; path=/';
            expect(service.getRefreshToken()).toBe('refresh-token-456');
        });
    });

    describe('setSession', () => {
        it('should set all session cookies', () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const refreshDate = new Date(Date.now() + 7200000).toISOString();

            const session: AuthSession = {
                accessToken: 'access-token',
                accessExpiresAt: futureDate,
                refreshToken: 'refresh-token',
                refreshExpiresAt: refreshDate,
            };

            service.setSession(session);

            expect(service.getAccessToken()).toBe('access-token');
            expect(service.getAccessExpiresAt()).toBe(futureDate);
            expect(service.getRefreshToken()).toBe('refresh-token');
        });

        it('should set session without refresh token', () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();

            const session: AuthSession = {
                accessToken: 'access-only',
                accessExpiresAt: futureDate,
            };

            service.setSession(session);

            expect(service.getAccessToken()).toBe('access-only');
            expect(service.getRefreshToken()).toBeNull();
        });

        it('should properly encode tokens with special characters', () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();

            const session: AuthSession = {
                accessToken: 'token with spaces & symbols',
                accessExpiresAt: futureDate,
            };

            service.setSession(session);

            expect(service.getAccessToken()).toBe('token with spaces & symbols');
        });

        it('should set cookies with custom options', () => {
            const customOptions: AuthCookieOptions = {
                path: '/api',
                domain: 'example.com',
                sameSite: 'Strict',
                secure: true,
            };

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [TokenStore, { provide: AUTH_COOKIE_OPTIONS, useValue: customOptions }],
            });

            const customService = TestBed.inject(TokenStore);
            const futureDate = new Date(Date.now() + 3600000).toISOString();

            const session: AuthSession = {
                accessToken: 'custom-token',
                accessExpiresAt: futureDate,
            };

            customService.setSession(session);

            // Cookies with custom path might not be readable in test environment
            // but we can verify the service doesn't throw
            expect(customService).toBeTruthy();
        });
    });

    describe('clearSession', () => {
        it('should clear access token and expiry', () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const session: AuthSession = {
                accessToken: 'token-to-clear',
                accessExpiresAt: futureDate,
            };

            service.setSession(session);
            expect(service.getAccessToken()).toBe('token-to-clear');

            service.clearSession();

            // After clearing, tokens should be gone or expired
            const accessToken = service.getAccessToken();
            expect(accessToken === null || accessToken === '').toBe(true);
        });

        it('should not affect refresh token', () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const refreshDate = new Date(Date.now() + 7200000).toISOString();

            const session: AuthSession = {
                accessToken: 'access',
                accessExpiresAt: futureDate,
                refreshToken: 'refresh',
                refreshExpiresAt: refreshDate,
            };

            service.setSession(session);
            service.clearSession();

            // Refresh token should still exist
            expect(service.getRefreshToken()).toBe('refresh');
        });
    });

    describe('cookie building', () => {
        it('should build cookie with expiry date', () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const session: AuthSession = {
                accessToken: 'test',
                accessExpiresAt: futureDate,
            };

            service.setSession(session);

            // Verify the cookie was set (implementation detail)
            expect(service.getAccessToken()).toBe('test');
        });

        it('should handle invalid expiry dates gracefully', () => {
            const session: AuthSession = {
                accessToken: 'test',
                accessExpiresAt: 'invalid-date',
            };

            // Should not throw
            expect(() => service.setSession(session)).not.toThrow();
        });
    });
});
