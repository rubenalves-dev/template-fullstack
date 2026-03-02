import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
    AUTH_REFRESH_BUFFER_MS,
    AuthService,
    Menu,
    ProfileService,
    TokenStore,
    User,
} from '@template-fullstack-client/api';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { Logger } from '../../../core/logger/logger';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly authService = inject(AuthService);
    private readonly profileService = inject(ProfileService);
    private readonly tokenStore = inject(TokenStore);
    private readonly router = inject(Router);
    private readonly logger = inject(Logger);
    private readonly refreshBufferMs = inject(AUTH_REFRESH_BUFFER_MS);

    private readonly userSignal = signal<User | null>(null);
    private readonly menuSignal = signal<Menu[] | null>(null);

    readonly user = this.userSignal.asReadonly();
    readonly menu = this.menuSignal.asReadonly();

    readonly isAuthenticated = this.authService.isAuthenticated;
    readonly isReady = computed(() => !!this.user() && !!this.menu());

    initialize() {
        if (!this.isAuthenticated()) {
            if (!this.tokenStore.getRefreshToken()) {
                this.logout();
                return of(true);
            }

            return this.authService.refresh().pipe(
                switchMap(() => this.loadProfileAndMenu()),
                catchError((err) => {
                    this.logout();
                    return of(false);
                }),
            );
        }

        this.logger.info('Valid session found, loading profile and menu');
        const accessExpiresAt = this.authService.session()?.accessExpiresAt;
        if (this.shouldRefreshNow(accessExpiresAt)) {
            return this.authService.refresh().pipe(
                switchMap(() => this.loadProfileAndMenu()),
                catchError((err) => {
                    this.logout();
                    return of(false);
                }),
            );
        }

        return this.loadProfileAndMenu();
    }

    private loadProfileAndMenu() {
        if (!this.isAuthenticated()) {
            this.logger.warn(
                'Attempted to load profile and menu without a valid session',
            );
            return of(true);
        }

        return forkJoin({
            user: this.profileService.getMe(),
            menu: this.profileService.getMyMenu(),
        }).pipe(
            tap(({ user, menu }) => {
                this.userSignal.set(user);
                this.menuSignal.set(menu);
            }),
            catchError((err) => {
                this.logger.error('Failed to initialize session', err);
                this.logout();
                return of(false);
            }),
        );
    }

    private shouldRefreshNow(accessExpiresAt?: string): boolean {
        if (!accessExpiresAt) {
            return true;
        }

        const expiresAtMs = Date.parse(accessExpiresAt);
        if (Number.isNaN(expiresAtMs)) {
            return true;
        }

        return expiresAtMs - Date.now() <= this.refreshBufferMs;
    }

    logout() {
        this.authService.logout();
        this.userSignal.set(null);
        this.menuSignal.set(null);
        this.router.navigate(['auth', 'login']);
    }
}
