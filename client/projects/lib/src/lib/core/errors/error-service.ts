import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

import { NormalizedError } from '../api/dtos';
import { AppContextService } from '../environment/app-context-service';
import { LoggerService } from '../logging/logger-service';
import { ErrorMapper } from './error-mapper';

export const ERROR_LOGGING_API_URL = new InjectionToken<string>('ERROR_LOGGING_API_URL', {
    factory: () => '',
});

export interface LogErrorRequest {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
    userAgent?: string;
    url?: string;
}

/**
 * Error handling service focused on error-specific operations.
 * Handles error normalization, exception creation, and remote error submission.
 *
 * Uses LoggerService for logging and AppContextService for runtime context.
 */
@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    private readonly http = inject(HttpClient);
    private readonly errorMapper = inject(ErrorMapper);
    private readonly logger = inject(LoggerService);
    private readonly appContext = inject(AppContextService);
    private readonly loggingApiUrl = inject(ERROR_LOGGING_API_URL);

    /**
     * Normalize any error into a standardized format.
     */
    normalize(error: unknown): NormalizedError {
        return this.errorMapper.normalize(error);
    }

    /**
     * Create an Error object from a normalized error.
     * Useful for re-throwing standardized errors.
     */
    newError(error: NormalizedError): Error {
        const exception = new Error(error.message);
        exception.name = error.code;
        (exception as Error & { details?: unknown }).details = error.details;
        return exception;
    }

    /**
     * Throw a standardized exception.
     * Normalizes the error first, then throws it.
     */
    throw(error: unknown): never {
        const normalized = this.normalize(error);
        throw this.newError(normalized);
    }

    /**
     * Submit error to remote logging API for persistence.
     * Fails silently to avoid error loops.
     *
     * Note: The backend endpoint is still WIP.
     */
    submitToServer(error: NormalizedError): void {
        if (!this.loggingApiUrl) {
            this.logger.debug('Error logging API URL not configured. Skipping remote submission.');
            return;
        }

        const logRequest: LogErrorRequest = {
            code: error.code,
            message: error.message,
            details: error.details,
            timestamp: new Date().toISOString(),
            userAgent: this.appContext.getUserAgent(),
            url: this.appContext.getCurrentUrl(),
        };

        this.http
            .post(`${this.loggingApiUrl}/logs/errors`, logRequest)
            .pipe(
                catchError((err) => {
                    // Fail silently to avoid error loops
                    this.logger.debug('Failed to submit error to server', err);
                    return of(null);
                }),
            )
            .subscribe();
    }

    /**
     * Handle error with full processing pipeline:
     * 1. Normalize
     * 2. Log to console
     * 3. Submit to server (if configured)
     *
     * Returns the normalized error for further processing.
     */
    handle(error: unknown): NormalizedError {
        const normalized = this.normalize(error);
        this.logger.error(`${normalized.code}: ${normalized.message}`, {
            details: normalized.details,
            original: normalized.originalError,
        });
        this.submitToServer(normalized);
        return normalized;
    }

    /**
     * Format error for display to end users.
     * Returns a user-friendly message without technical details.
     */
    formatForUser(error: NormalizedError): string {
        // Don't expose technical error codes to users
        if (error.code.startsWith('HTTP_') || error.code === 'CLIENT_ERROR') {
            return error.message;
        }

        // For unknown errors, provide a generic message
        if (error.code === 'UNKNOWN_ERROR') {
            return 'An unexpected error occurred. Please try again or contact support.';
        }

        return error.message;
    }
}
