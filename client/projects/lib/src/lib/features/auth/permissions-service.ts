import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ApiResponse } from '../../core/api/dtos';
import { AUTHZ_API_BASE_URL } from './auth-tokens';
import { AddPermissionRequest, AssignRoleRequest, CreateRoleRequest, Role } from './dtos';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTHZ_API_BASE_URL);

    getRoles() {
        return this.http.get<ApiResponse<Role[]>>(`${this.baseUrl}/backoffice/roles`);
    }

    createRole(request: CreateRoleRequest) {
        return this.http.post<ApiResponse<Role>>(`${this.baseUrl}/backoffice/roles`, request);
    }

    addPermissionToRole(roleId: string | number, request: AddPermissionRequest) {
        return this.http.post<ApiResponse<unknown>>(
            `${this.baseUrl}/backoffice/roles/${roleId}/permissions`,
            request,
        );
    }

    assignRoleToUser(userId: string | number, request: AssignRoleRequest) {
        return this.http.post<ApiResponse<unknown>>(
            `${this.baseUrl}/backoffice/users/${userId}/roles`,
            request,
        );
    }
}
