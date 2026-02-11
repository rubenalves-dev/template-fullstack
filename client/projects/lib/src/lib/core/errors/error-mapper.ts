import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiError, NormalizedError } from '../api/dtos';

/**
 * Error mapper service that normalizes different error types into a standard format.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorMapper {
  /**
   * Normalize any error into a standardized NormalizedError structure.
   */
  normalize(error: unknown): NormalizedError {
    // HTTP Error Response (from Angular HttpClient)
    if (error instanceof HttpErrorResponse) {
      return this.normalizeHttpError(error);
    }

    // Standard Error object
    if (error instanceof Error) {
      return {
        code: 'CLIENT_ERROR',
        message: error.message,
        details: {
          name: error.name,
          stack: error.stack,
        },
        originalError: error,
      };
    }

    // String error
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        originalError: error,
      };
    }

    // Unknown error type
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
      originalError: error,
    };
  }

  /**
   * Normalize HTTP errors into standard format.
   * Handles both API error responses and generic HTTP errors.
   */
  private normalizeHttpError(httpError: HttpErrorResponse): NormalizedError {
    // Try to extract API error from response body
    if (httpError.error && this.isApiError(httpError.error)) {
      return {
        code: httpError.error.error.code,
        message: httpError.error.error.message,
        details: httpError.error.error.details,
        originalError: httpError,
      };
    }

    // Generic HTTP error
    return {
      code: `HTTP_${httpError.status}`,
      message: this.getHttpErrorMessage(httpError),
      details: {
        status: httpError.status,
        statusText: httpError.statusText,
        url: httpError.url,
        body: httpError.error,
      },
      originalError: httpError,
    };
  }

  /**
   * Type guard to check if an object is an ApiError.
   */
  private isApiError(obj: unknown): obj is ApiError {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'error' in obj &&
      typeof (obj as ApiError).error === 'object' &&
      (obj as ApiError).error !== null &&
      'code' in (obj as ApiError).error &&
      'message' in (obj as ApiError).error
    );
  }

  /**
   * Get a user-friendly message for HTTP errors.
   */
  private getHttpErrorMessage(httpError: HttpErrorResponse): string {
    if (httpError.status === 0) {
      return 'Network error. Please check your internet connection.';
    }

    if (httpError.status >= 500) {
      return 'Server error. Please try again later.';
    }

    if (httpError.status === 404) {
      return 'The requested resource was not found.';
    }

    if (httpError.status === 403) {
      return 'You do not have permission to access this resource.';
    }

    if (httpError.status === 401) {
      return 'Authentication required. Please log in.';
    }

    if (httpError.status >= 400) {
      return httpError.error?.message || 'Invalid request. Please check your input.';
    }

    return httpError.message || 'An error occurred while processing your request.';
  }
}
