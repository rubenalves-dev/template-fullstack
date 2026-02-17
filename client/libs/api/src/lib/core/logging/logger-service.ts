import { Injectable, inject } from '@angular/core';

import { IS_PRODUCTION } from '../environment/app-context-service';

/**
 * Generic logging service for application-wide logging.
 * Provides multi-level logging with production-safe debug output.
 */
@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    private readonly isProduction = inject(IS_PRODUCTION);

    /**
     * Log error message to console.
     */
    error(message: string, context?: unknown): void {
        console.error(`[ERROR] ${message}`, context);
    }

    /**
     * Log warning message to console.
     */
    warn(message: string, context?: unknown): void {
        console.warn(`[WARNING] ${message}`, context);
    }

    /**
     * Log info message to console.
     */
    info(message: string, context?: unknown): void {
        console.info(`[INFO] ${message}`, context);
    }

    /**
     * Log debug message to console (only in development).
     */
    debug(message: string, context?: unknown): void {
        if (!this.isProduction) {
            console.debug(`[DEBUG] ${message}`, context);
        }
    }

    /**
     * Log a group of related messages.
     */
    group(label: string, callback: () => void): void {
        console.group(label);
        callback();
        console.groupEnd();
    }

    /**
     * Log execution time of an operation.
     */
    time(label: string): void {
        console.time(label);
    }

    /**
     * End timing of an operation.
     */
    timeEnd(label: string): void {
        console.timeEnd(label);
    }
}
