import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../../../core/api/api-client';
import {
  AddPermissionRequest,
  AssignRoleRequest,
  CreateRoleRequest,
} from '../types/dtos';
import { Role } from '../types/schemas';
import { AUTHZ_API_BASE_URL } from './auth-tokens';
import { PermissionsService } from './permissions-service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let apiClient: ApiClient;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    const apiClientMock = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PermissionsService,
        { provide: ApiClient, useValue: apiClientMock },
        { provide: AUTHZ_API_BASE_URL, useValue: baseUrl },
      ],
    });

    service = TestBed.inject(PermissionsService);
    apiClient = TestBed.inject(ApiClient);
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getRoles', () => {
    it('should fetch all roles', async () => {
      const mockRoles: Role[] = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
      ];

      const apiClientMock = apiClient as any;
      apiClientMock.get.mockReturnValue(of(mockRoles));

      const roles = await lastValueFrom(service.getRoles());

      expect(roles).toEqual(mockRoles);
      expect(apiClientMock.get).toHaveBeenCalledWith(
        `${baseUrl}/backoffice/roles`,
      );
    });

    it('should return empty array when no roles exist', async () => {
      const apiClientMock = apiClient as any;
      apiClientMock.get.mockReturnValue(of([]));

      const roles = await lastValueFrom(service.getRoles());

      expect(roles).toEqual([]);
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const request: CreateRoleRequest = { name: 'Editor' };
      const mockRole: Role = { id: 3, name: 'Editor' };

      const apiClientMock = apiClient as any;
      apiClientMock.post.mockReturnValue(of(mockRole));

      const role = await lastValueFrom(service.createRole(request));

      expect(role).toEqual(mockRole);
      expect(apiClientMock.post).toHaveBeenCalledWith(
        `${baseUrl}/backoffice/roles`,
        request,
      );
    });

    it('should handle role creation with special characters', async () => {
      const request: CreateRoleRequest = { name: 'Content-Admin' };
      const mockRole: Role = { id: 4, name: 'Content-Admin' };

      const apiClientMock = apiClient as any;
      apiClientMock.post.mockReturnValue(of(mockRole));

      const role = await lastValueFrom(service.createRole(request));

      expect(role.name).toBe('Content-Admin');
    });
  });

  describe('addPermissionToRole', () => {
    it('should add permission to role using string id', async () => {
      const roleId = 'role-123';
      const request: AddPermissionRequest = { permission_id: 'perm-456' };

      const apiClientMock = apiClient as any;
      apiClientMock.post.mockReturnValue(of({}));

      const response = await lastValueFrom(
        service.addPermissionToRole(roleId, request),
      );

      expect(response).toEqual({});
      expect(apiClientMock.post).toHaveBeenCalledWith(
        `${baseUrl}/backoffice/roles/${roleId}/permissions`,
        request,
      );
    });

    it('should add permission to role using numeric id', async () => {
      const roleId = 1;
      const request: AddPermissionRequest = { permission_id: 'read:users' };

      const apiClientMock = apiClient as any;
      apiClientMock.post.mockReturnValue(of({}));

      await lastValueFrom(service.addPermissionToRole(roleId, request));

      expect(apiClientMock.post).toHaveBeenCalledWith(
        `${baseUrl}/backoffice/roles/1/permissions`,
        request,
      );
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign role to user using string id', async () => {
      const userId = 'user-789';
      const request: AssignRoleRequest = { role_id: 1 };

      const apiClientMock = apiClient as any;
      apiClientMock.post.mockReturnValue(of({}));

      const response = await lastValueFrom(
        service.assignRoleToUser(userId, request),
      );

      expect(response).toEqual({});
      expect(apiClientMock.post).toHaveBeenCalledWith(
        `${baseUrl}/backoffice/users/${userId}/roles`,
        request,
      );
    });

    it('should assign role to user using numeric id', async () => {
      const userId = 42;
      const request: AssignRoleRequest = { role_id: 2 };

      const apiClientMock = apiClient as any;
      apiClientMock.post.mockReturnValue(of({}));

      await lastValueFrom(service.assignRoleToUser(userId, request));

      expect(apiClientMock.post).toHaveBeenCalledWith(
        `${baseUrl}/backoffice/users/42/roles`,
        request,
      );
    });
  });
});
