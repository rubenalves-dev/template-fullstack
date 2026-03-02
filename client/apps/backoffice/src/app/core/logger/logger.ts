import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '../environment/environment.token';

@Injectable({
    providedIn: 'root',
})
export class Logger {
    private readonly env = inject(ENVIRONMENT);
    private readonly isProduction = this.env.production;
    private readonly prefix = 'BO';

    info(message: string, ...args: unknown[]): void {
        if (this.isProduction) return;
        console.log(`[${this.prefix}] ${message}`, ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        if (this.isProduction) return;
        console.warn(`[${this.prefix}] ${message}`, ...args);
    }

    error(message: string, ...args: unknown[]): void {
        console.error(`[${this.prefix}] ${message}`, ...args);
    }

    debug(message: string, ...args: unknown[]): void {
        if (this.isProduction) return;
        console.debug(`[${this.prefix}] ${message}`, ...args);
    }
}
