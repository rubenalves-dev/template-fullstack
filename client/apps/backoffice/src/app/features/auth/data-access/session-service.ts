import { computed, inject, Injectable, signal } from '@angular/core';
import {
    AuthService,
    Menu,
    ProfileService,
    TokenStore,
    User,
} from '@template-fullstack-client/api';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly authService = inject(AuthService);
    private readonly profileService = inject(ProfileService);
    private readonly tokenStore = inject(TokenStore);
    private readonly router = inject(Router);

    private readonly userSignal = signal<User | null>(null);
    private readonly menuSignal = signal<Menu[] | null>(null);

    readonly user = this.userSignal.asReadonly();
    readonly menu = this.menuSignal.asReadonly();

    readonly isAuthenticated = this.authService.isAuthenticated();
    readonly isReady = computed(() => !!this.user && !!this.menu);

    initialize() {
        if (!this.isAuthenticated) {
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
                console.error('Failed to initialize session', err);
                this.logout();
                return of(false);
            }),
        );
    }

    logout() {
        this.authService.logout();
        this.userSignal.set(null);
        this.menuSignal.set(null);
        this.router.navigate(['/login']);
    }
}
