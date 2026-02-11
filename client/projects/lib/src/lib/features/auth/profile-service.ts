import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AUTH_API_BASE_URL } from './auth-tokens';
import { ApiResponse, Menu, User } from './dtos';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_BASE_URL);

    getMe() {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`);
    }

    getMyMenu() {
        return this.http.get<ApiResponse<Menu>>(`${this.baseUrl}/backoffice/me/menu`);
    }

    // TODO: Implement settings endpoints when backend is ready
    // getSettings() {}
    // updateSettings() {}
}
