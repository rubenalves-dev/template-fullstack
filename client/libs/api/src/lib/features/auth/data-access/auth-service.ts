import { isPlatformBrowser } from '@angular/common';
import {
    computed,
    DestroyRef,
    inject,
    Injectable,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { ApiClient } from '../../../core/api/api-client';
import {
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthTokensResponse,
    RefreshRequest,
} from '../types/dtos';
import { AuthSession } from '../types/schemas';
import { AUTH_API_BASE_URL, AUTH_REFRESH_BUFFER_MS } from './auth-tokens';
import { TokenStore } from './token-store';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly api = inject(ApiClient);
    private readonly tokenStore = inject(TokenStore);
    private readonly baseUrl = inject(AUTH_API_BASE_URL);
    private readonly refreshBufferMs = inject(AUTH_REFRESH_BUFFER_MS);
    private readonly destroyRef = inject(DestroyRef);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    private readonly sessionSignal = signal<AuthSession | null>(null);
    readonly session = this.sessionSignal.asReadonly();
    readonly accessToken = computed(
        () => this.sessionSignal()?.accessToken ?? null,
    );
    readonly isAuthenticated = computed(() => {
        const session = this.sessionSignal();
        if (!session) {
            return false;
        }
        return !this.isExpired(session.accessExpiresAt);
    });

    private refreshTimerId: number | null = null;

    constructor() {
        this.destroyRef.onDestroy(() => this.clearRefreshTimer());
        this.restoreSession();
    }

    login(request: AuthLoginRequest) {
        return this.api
            .post<AuthTokensResponse>(`${this.baseUrl}/auth/login`, request, {
                withCredentials: false, // TODO: Change this to true when near prod
            })
            .pipe(map((response) => this.applyTokens(response)));
    }

    register(request: AuthRegisterRequest) {
        return this.api
            .post<AuthTokensResponse>(
                `${this.baseUrl}/auth/register`,
                request,
                {
                    withCredentials: false, // TODO: Change this to true when near prod
                },
            )
            .pipe(map((response) => this.applyTokens(response)));
    }

    refresh() {
        const refreshToken = this.tokenStore.getRefreshToken();
        const payload: RefreshRequest = refreshToken
            ? { refresh_token: refreshToken }
            : {};

        return this.api
            .post<AuthTokensResponse>(`${this.baseUrl}/auth/refresh`, payload, {
                withCredentials: false, // TODO: Change this to true when near prod
            })
            .pipe(map((response) => this.applyTokens(response)));
    }

    logout(): void {
        this.clearSession();
    }

    private restoreSession(): void {
        const accessToken = this.tokenStore.getAccessToken();
        const accessExpiresAt = this.tokenStore.getAccessExpiresAt();

        if (
            !accessToken ||
            !accessExpiresAt ||
            this.isExpired(accessExpiresAt)
        ) {
            this.clearSession();
            return;
        }

        const session: AuthSession = {
            accessToken,
            accessExpiresAt,
        };

        this.sessionSignal.set(session);
        this.scheduleRefresh(accessExpiresAt);
    }

    private applyTokens(tokens: AuthTokensResponse): AuthSession {
        const session: AuthSession = {
            accessToken: tokens.access_token,
            accessExpiresAt: tokens.access_expires_at,
            refreshToken: tokens.refresh_token,
            refreshExpiresAt: tokens.refresh_expires_at,
        };

        this.tokenStore.setSession(session);
        this.sessionSignal.set(session);
        this.scheduleRefresh(session.accessExpiresAt);

        return session;
    }

    private scheduleRefresh(accessExpiresAt: string): void {
        this.clearRefreshTimer();

        if (!this.isBrowser) {
            return;
        }

        const refreshAt =
            this.toEpochMs(accessExpiresAt) - this.refreshBufferMs;
        const delay = refreshAt - Date.now();

        if (delay <= 0) {
            this.triggerRefresh();
            return;
        }

        this.refreshTimerId = window.setTimeout(
            () => this.triggerRefresh(),
            delay,
        );
    }

    private triggerRefresh(): void {
        this.refresh()
            .pipe(
                catchError(() => {
                    this.clearSession();
                    return of(null);
                }),
            )
            .subscribe();
    }

    private clearSession(): void {
        this.clearRefreshTimer();
        this.tokenStore.clearSession();
        this.sessionSignal.set(null);
    }

    private clearRefreshTimer(): void {
        if (this.refreshTimerId === null) {
            return;
        }

        window.clearTimeout(this.refreshTimerId);
        this.refreshTimerId = null;
    }

    private isExpired(expiresAt: string): boolean {
        return this.toEpochMs(expiresAt) <= Date.now();
    }

    private toEpochMs(expiresAt: string): number {
        const parsed = Date.parse(expiresAt);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
}
