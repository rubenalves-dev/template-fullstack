import { Injectable, inject } from '@angular/core';

import { ApiClient } from '../../core/api/api-client';
import { AUTH_API_BASE_URL } from './auth-tokens';
import { Menu, User } from './dtos';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private readonly api = inject(ApiClient);
    private readonly baseUrl = inject(AUTH_API_BASE_URL);

    getMe() {
        return this.api.get<User>(`${this.baseUrl}/me`);
    }

    getMyMenu() {
        return this.api.get<Menu>(`${this.baseUrl}/backoffice/me/menu`);
    }

    // TODO: Implement settings endpoints when backend is ready
    // getSettings() {}
    // updateSettings() {}
}
