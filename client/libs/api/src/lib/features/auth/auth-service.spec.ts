import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../../core/api/api-client';
import { AuthService } from './auth-service';
import { AUTH_API_BASE_URL, AUTH_REFRESH_BUFFER_MS } from './auth-tokens';
import { AuthTokensResponse } from './dtos';
import { TokenStore } from './token-store';

describe('AuthService', () => {
    let service: AuthService;
    let apiClient: ApiClient;
    let tokenStore: TokenStore;
    const baseUrl = 'https://api.example.com';

    beforeEach(() => {
        const apiClientMock = {
            post: vi.fn(),
        };

        const tokenStoreMock = {
            getAccessToken: vi.fn(),
            getAccessExpiresAt: vi.fn(),
            getRefreshToken: vi.fn(),
            setSession: vi.fn(),
            clearSession: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: ApiClient, useValue: apiClientMock },
                { provide: TokenStore, useValue: tokenStoreMock },
                { provide: AUTH_API_BASE_URL, useValue: baseUrl },
                { provide: AUTH_REFRESH_BUFFER_MS, useValue: 60000 },
            ],
        });

        service = TestBed.inject(AuthService);
        apiClient = TestBed.inject(ApiClient);
        tokenStore = TestBed.inject(TokenStore);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should initialize with null session', () => {
            expect(service.session()).toBeNull();
            expect(service.accessToken()).toBeNull();
            expect(service.isAuthenticated()).toBe(false);
        });

        it('should restore valid session from token store', () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const tokenStoreMock = tokenStore as any;

            tokenStoreMock.getAccessToken.mockReturnValue('valid-token');
            tokenStoreMock.getAccessExpiresAt.mockReturnValue(futureDate);

            const newService = TestBed.inject(AuthService);

            expect(newService.session()).toEqual({
                accessToken: 'valid-token',
                accessExpiresAt: futureDate,
            });
            expect(newService.isAuthenticated()).toBe(true);
        });

        it('should clear expired session from token store', () => {
            const pastDate = new Date(Date.now() - 3600000).toISOString();
            const tokenStoreMock = tokenStore as any;

            tokenStoreMock.getAccessToken.mockReturnValue('expired-token');
            tokenStoreMock.getAccessExpiresAt.mockReturnValue(pastDate);

            const newService = TestBed.inject(AuthService);

            expect(tokenStoreMock.clearSession).toHaveBeenCalled();
            expect(newService.session()).toBeNull();
            expect(newService.isAuthenticated()).toBe(false);
        });
    });

    describe('login', () => {
        it('should login successfully and set session', async () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const mockResponse: AuthTokensResponse = {
                access_token: 'test-access-token',
                refresh_token: 'test-refresh-token',
                access_expires_at: futureDate,
                refresh_expires_at: new Date(Date.now() + 7200000).toISOString(),
            };

            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of(mockResponse));

            const loginRequest = { email: 'test@example.com', password: 'password123' };

            const session = await lastValueFrom(service.login(loginRequest));

            expect(session.accessToken).toBe('test-access-token');
            expect(session.refreshToken).toBe('test-refresh-token');
            expect(service.session()).toEqual(session);
            expect(service.isAuthenticated()).toBe(true);
            expect(apiClientMock.post).toHaveBeenCalledWith(`${baseUrl}/auth/login`, loginRequest, {
                withCredentials: true,
            });
            expect(tokenStore.setSession).toHaveBeenCalledWith(session);
        });

        it('should handle login error', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(throwError(() => new Error('Invalid credentials')));

            const loginRequest = { email: 'test@example.com', password: 'wrong' };

            await expect(lastValueFrom(service.login(loginRequest))).rejects.toThrow(
                'Invalid credentials',
            );
            expect(service.session()).toBeNull();
        });
    });

    describe('register', () => {
        it('should register successfully and set session', async () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const mockResponse: AuthTokensResponse = {
                access_token: 'test-access-token',
                access_expires_at: futureDate,
            };

            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of(mockResponse));

            const registerRequest = {
                email: 'new@example.com',
                password: 'password123',
                full_name: 'Test User',
            };

            const session = await lastValueFrom(service.register(registerRequest));

            expect(session.accessToken).toBe('test-access-token');
            expect(service.isAuthenticated()).toBe(true);
            expect(apiClientMock.post).toHaveBeenCalledWith(
                `${baseUrl}/auth/register`,
                registerRequest,
                { withCredentials: true },
            );
        });
    });

    describe('refresh', () => {
        it('should refresh token with refresh token from store', async () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const mockResponse: AuthTokensResponse = {
                access_token: 'new-access-token',
                access_expires_at: futureDate,
            };

            const tokenStoreMock = tokenStore as any;
            const apiClientMock = apiClient as any;

            tokenStoreMock.getRefreshToken.mockReturnValue('stored-refresh-token');
            apiClientMock.post.mockReturnValue(of(mockResponse));

            const session = await lastValueFrom(service.refresh());

            expect(session.accessToken).toBe('new-access-token');
            expect(apiClientMock.post).toHaveBeenCalledWith(
                `${baseUrl}/auth/refresh`,
                { refresh_token: 'stored-refresh-token' },
                { withCredentials: true },
            );
        });

        it('should refresh token without refresh token', async () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const mockResponse: AuthTokensResponse = {
                access_token: 'new-access-token',
                access_expires_at: futureDate,
            };

            const tokenStoreMock = tokenStore as any;
            const apiClientMock = apiClient as any;

            tokenStoreMock.getRefreshToken.mockReturnValue(null);
            apiClientMock.post.mockReturnValue(of(mockResponse));

            await lastValueFrom(service.refresh());

            expect(apiClientMock.post).toHaveBeenCalledWith(
                `${baseUrl}/auth/refresh`,
                {},
                { withCredentials: true },
            );
        });
    });

    describe('logout', () => {
        it('should clear session', async () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const mockResponse: AuthTokensResponse = {
                access_token: 'test-token',
                access_expires_at: futureDate,
            };

            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of(mockResponse));

            await lastValueFrom(service.login({ email: 'test@example.com', password: 'pass' }));

            expect(service.isAuthenticated()).toBe(true);

            service.logout();

            expect(service.session()).toBeNull();
            expect(service.isAuthenticated()).toBe(false);
            expect(tokenStore.clearSession).toHaveBeenCalled();
        });
    });

    describe('computed signals', () => {
        it('should compute accessToken from session', async () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const mockResponse: AuthTokensResponse = {
                access_token: 'computed-token',
                access_expires_at: futureDate,
            };

            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of(mockResponse));

            await lastValueFrom(service.login({ email: 'test@example.com', password: 'pass' }));

            expect(service.accessToken()).toBe('computed-token');
        });

        it('should return null accessToken when no session', () => {
            expect(service.accessToken()).toBeNull();
        });

        it('should compute isAuthenticated based on token expiry', async () => {
            const futureDate = new Date(Date.now() + 3600000).toISOString();
            const mockResponse: AuthTokensResponse = {
                access_token: 'test-token',
                access_expires_at: futureDate,
            };

            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of(mockResponse));

            await lastValueFrom(service.login({ email: 'test@example.com', password: 'pass' }));

            expect(service.isAuthenticated()).toBe(true);
        });
    });
});
