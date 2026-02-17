/**
 * Standard API response wrapper used by all backend endpoints.
 */
export interface ApiResponse<T> {
    data: T;
}

/**
 * Standard API error response structure.
 */
export interface ApiError {
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

/**
 * Normalized error structure for consistent client-side error handling.
 */
export interface NormalizedError {
    code: string;
    message: string;
    details?: unknown;
    originalError?: unknown;
}
