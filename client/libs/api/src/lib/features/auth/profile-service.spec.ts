import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../../core/api/api-client';
import { AUTH_API_BASE_URL } from './auth-tokens';
import { Menu, User } from './dtos';
import { ProfileService } from './profile-service';

describe('ProfileService', () => {
    let service: ProfileService;
    let apiClient: ApiClient;
    const baseUrl = 'https://api.example.com';

    beforeEach(() => {
        const apiClientMock = {
            get: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                ProfileService,
                { provide: ApiClient, useValue: apiClientMock },
                { provide: AUTH_API_BASE_URL, useValue: baseUrl },
            ],
        });

        service = TestBed.inject(ProfileService);
        apiClient = TestBed.inject(ApiClient);
    });

    describe('initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('getMe', () => {
        it('should fetch current user profile', async () => {
            const mockUser: User = {
                id: 'user-123',
                email: 'test@example.com',
                full_name: 'Test User',
            };

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockUser));

            const user = await lastValueFrom(service.getMe());

            expect(user).toEqual(mockUser);
            expect(apiClientMock.get).toHaveBeenCalledWith(`${baseUrl}/me`);
        });

        it('should fetch user with roles', async () => {
            const mockUser: User = {
                id: 'user-456',
                email: 'admin@example.com',
                full_name: 'Admin User',
                roles: [
                    { id: 1, name: 'Admin' },
                    { id: 2, name: 'Editor' },
                ],
            };

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockUser));

            const user = await lastValueFrom(service.getMe());

            expect(user.roles).toHaveLength(2);
            expect(user.roles![0].name).toBe('Admin');
        });

        it('should fetch user with timestamps', async () => {
            const mockUser: User = {
                id: 'user-789',
                email: 'user@example.com',
                full_name: 'Regular User',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-02T00:00:00Z',
            };

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockUser));

            const user = await lastValueFrom(service.getMe());

            expect(user.created_at).toBe('2024-01-01T00:00:00Z');
            expect(user.updated_at).toBe('2024-01-02T00:00:00Z');
        });

        it('should handle error when fetching user profile', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(throwError(() => new Error('Unauthorized')));

            await expect(lastValueFrom(service.getMe())).rejects.toThrow('Unauthorized');
        });
    });

    describe('getMyMenu', () => {
        it('should fetch user menu', async () => {
            const mockMenu: Menu = {
                dashboard: { label: 'Dashboard', path: '/dashboard' },
                users: { label: 'Users', path: '/users' },
            };

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockMenu));

            const menu = await lastValueFrom(service.getMyMenu());

            expect(menu).toEqual(mockMenu);
            expect(apiClientMock.get).toHaveBeenCalledWith(`${baseUrl}/backoffice/me/menu`);
        });

        it('should fetch empty menu', async () => {
            const mockMenu: Menu = {};

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockMenu));

            const menu = await lastValueFrom(service.getMyMenu());

            expect(menu).toEqual({});
            expect(Object.keys(menu)).toHaveLength(0);
        });

        it('should fetch complex nested menu structure', async () => {
            const mockMenu: Menu = {
                settings: {
                    label: 'Settings',
                    children: [
                        { label: 'Profile', path: '/settings/profile' },
                        { label: 'Security', path: '/settings/security' },
                    ],
                },
            };

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockMenu));

            const menu = await lastValueFrom(service.getMyMenu());

            expect(menu['settings']).toBeDefined();
        });

        it('should handle error when fetching menu', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(throwError(() => new Error('Forbidden')));

            await expect(lastValueFrom(service.getMyMenu())).rejects.toThrow('Forbidden');
        });
    });
});
