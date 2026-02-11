import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

import { NormalizedError } from '../api/dtos';
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
 * Centralized error handling service for consistent error processing across the application.
 *
 * Features:
 * - Error normalization and standardization
 * - Console logging with different severity levels
 * - Remote error logging to backend
 * - Exception creation and throwing
 * - User-friendly error formatting
 *
 * Usage:
 * ```typescript
 * constructor(private errorHandler = inject(ErrorHandlerService)) {}
 *
 * handleError(error: unknown) {
 *   const normalized = this.errorHandler.normalize(error);
 *   this.errorHandler.logError(normalized);
 *   this.errorHandler.submitToServer(normalized);
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly http = inject(HttpClient);
  private readonly errorMapper = inject(ErrorMapper);
  private readonly loggingApiUrl = inject(ERROR_LOGGING_API_URL);

  /**
   * Normalize any error into a standardized format.
   * Delegates to ErrorMapper for the actual normalization logic.
   */
  normalize(error: unknown): NormalizedError {
    return this.errorMapper.normalize(error);
  }

  /**
   * Log error to console with ERROR level.
   * Includes the full normalized error object.
   */
  logError(error: NormalizedError): void {
    console.error(`[ERROR] ${error.code}: ${error.message}`, {
      details: error.details,
      original: error.originalError,
    });
  }

  /**
   * Log warning to console with WARN level.
   */
  logWarning(message: string, details?: unknown): void {
    console.warn(`[WARNING] ${message}`, details);
  }

  /**
   * Log info message to console with INFO level.
   */
  logInfo(message: string, details?: unknown): void {
    console.info(`[INFO] ${message}`, details);
  }

  /**
   * Log debug message to console (only in development).
   */
  logDebug(message: string, details?: unknown): void {
    if (this.isDevelopment()) {
      console.debug(`[DEBUG] ${message}`, details);
    }
  }

  /**
   * Create an Error object from a normalized error.
   * Useful for re-throwing standardized errors.
   */
  createException(error: NormalizedError): Error {
    const exception = new Error(error.message);
    exception.name = error.code;
    (exception as Error & { details?: unknown }).details = error.details;
    return exception;
  }

  /**
   * Throw a standardized exception.
   * Normalizes the error first, then throws it.
   */
  throwError(error: unknown): never {
    const normalized = this.normalize(error);
    throw this.createException(normalized);
  }

  /**
   * Submit error to remote logging API for persistence.
   * Fails silently to avoid error loops.
   *
   * Note: The backend endpoint is still WIP.
   */
  submitToServer(error: NormalizedError): void {
    if (!this.loggingApiUrl) {
      this.logDebug('Error logging API URL not configured. Skipping remote submission.');
      return;
    }

    const logRequest: LogErrorRequest = {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
      userAgent: this.getUserAgent(),
      url: this.getCurrentUrl(),
    };

    this.http
      .post(`${this.loggingApiUrl}/logs/errors`, logRequest)
      .pipe(
        catchError((err) => {
          // Fail silently to avoid error loops
          this.logDebug('Failed to submit error to server', err);
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
    this.logError(normalized);
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

  /**
   * Check if the application is running in development mode.
   */
  private isDevelopment(): boolean {
    return !this.isProduction();
  }

  /**
   * Check if the application is running in production mode.
   */
  private isProduction(): boolean {
    // This could be configured via an injection token or environment variable
    return false; // Default to development for safety
  }

  /**
   * Get the current user agent string.
   */
  private getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  }

  /**
   * Get the current URL.
   */
  private getCurrentUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : 'Unknown';
  }
}
