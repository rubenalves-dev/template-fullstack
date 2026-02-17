import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from './dtos';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
    factory: () => '',
});

export interface RequestOptions {
    headers?:
        | HttpHeaders
        | {
              [header: string]: string | string[];
          };
    context?: HttpContext;
    observe?: 'body';
    params?:
        | HttpParams
        | {
              [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
          };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    baseUrl?: string;
}

/**
 * Base API client that wraps HttpClient and provides standardized request/response handling.
 *
 * Features:
 * - Automatic ApiResponse<T> unwrapping
 * - Configurable base URL per service
 * - Centralized error handling
 * - Type-safe HTTP methods
 *
 * Usage:
 * ```typescript
 * export class MyService {
 *   private readonly api = inject(ApiClient);
 *
 *   getData() {
 *     return this.api.get<MyType>('/endpoint');
 *   }
 * }
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class ApiClient {
    private readonly http = inject(HttpClient);
    private readonly defaultBaseUrl = inject(API_BASE_URL);

    /**
     * Perform a GET request.
     * Automatically unwraps ApiResponse<T> and returns Observable<T>.
     */
    get<T>(url: string, options?: RequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url, options?.baseUrl);
        return this.http
            .get<ApiResponse<T>>(fullUrl, options)
            .pipe(map((response) => response.data));
    }

    /**
     * Perform a POST request.
     * Automatically unwraps ApiResponse<T> and returns Observable<T>.
     */
    post<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url, options?.baseUrl);
        return this.http
            .post<ApiResponse<T>>(fullUrl, body, options)
            .pipe(map((response) => response.data));
    }

    /**
     * Perform a PUT request.
     * Automatically unwraps ApiResponse<T> and returns Observable<T>.
     */
    put<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url, options?.baseUrl);
        return this.http
            .put<ApiResponse<T>>(fullUrl, body, options)
            .pipe(map((response) => response.data));
    }

    /**
     * Perform a PATCH request.
     * Automatically unwraps ApiResponse<T> and returns Observable<T>.
     */
    patch<T>(url: string, body: unknown, options?: RequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url, options?.baseUrl);
        return this.http
            .patch<ApiResponse<T>>(fullUrl, body, options)
            .pipe(map((response) => response.data));
    }

    /**
     * Perform a DELETE request.
     * Automatically unwraps ApiResponse<T> and returns Observable<T>.
     */
    delete<T>(url: string, options?: RequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url, options?.baseUrl);
        return this.http
            .delete<ApiResponse<T>>(fullUrl, options)
            .pipe(map((response) => response.data));
    }

    /**
     * Build the full URL from base URL and endpoint.
     * Supports override base URL per request.
     */
    private buildUrl(endpoint: string, baseUrl?: string): string {
        const base = baseUrl ?? this.defaultBaseUrl;

        // If endpoint is already a full URL, return as is
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            return endpoint;
        }

        // Remove trailing slash from base and leading slash from endpoint
        const normalizedBase = base.replace(/\/$/, '');
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        return `${normalizedBase}${normalizedEndpoint}`;
    }
}
