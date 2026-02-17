import { Injectable, inject } from '@angular/core';

import { ApiClient } from '../../../core/api/api-client';
import {
  AddPermissionRequest,
  AssignRoleRequest,
  CreateRoleRequest,
} from '../types/dtos';
import { Role } from '../types/schemas';
import { AUTHZ_API_BASE_URL } from './auth-tokens';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private readonly api = inject(ApiClient);
  private readonly baseUrl = inject(AUTHZ_API_BASE_URL);

  getRoles() {
    return this.api.get<Role[]>(`${this.baseUrl}/backoffice/roles`);
  }

  createRole(request: CreateRoleRequest) {
    return this.api.post<Role>(`${this.baseUrl}/backoffice/roles`, request);
  }

  addPermissionToRole(roleId: string | number, request: AddPermissionRequest) {
    return this.api.post<unknown>(
      `${this.baseUrl}/backoffice/roles/${roleId}/permissions`,
      request,
    );
  }

  assignRoleToUser(userId: string | number, request: AssignRoleRequest) {
    return this.api.post<unknown>(
      `${this.baseUrl}/backoffice/users/${userId}/roles`,
      request,
    );
  }
}
