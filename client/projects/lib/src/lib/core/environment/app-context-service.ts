import { Injectable, InjectionToken, inject } from '@angular/core';

export const IS_PRODUCTION = new InjectionToken<boolean>('IS_PRODUCTION', {
    factory: () => false,
});

/**
 * Provides context information about the application runtime environment.
 * Includes environment detection and browser-specific utilities.
 */
@Injectable({
    providedIn: 'root',
})
export class AppContextService {
    private readonly isProduction = inject(IS_PRODUCTION);

    /**
     * Check if the application is running in production mode.
     */
    isProductionMode(): boolean {
        return this.isProduction;
    }

    /**
     * Check if the application is running in development mode.
     */
    isDevelopmentMode(): boolean {
        return !this.isProduction;
    }

    /**
     * Get the current user agent string.
     */
    getUserAgent(): string {
        return typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
    }

    /**
     * Get the current URL.
     */
    getCurrentUrl(): string {
        return typeof window !== 'undefined' ? window.location.href : 'Unknown';
    }

    /**
     * Get the current pathname.
     */
    getCurrentPath(): string {
        return typeof window !== 'undefined' ? window.location.pathname : 'Unknown';
    }

    /**
     * Check if code is running in a browser environment.
     */
    isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
}
