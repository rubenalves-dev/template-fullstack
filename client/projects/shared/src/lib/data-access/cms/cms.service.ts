import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, CmsPage, CmsPageLayoutRow, CmsPageMetadataUpdate } from './types';

@Injectable({
    providedIn: 'root',
})
export class CmsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8080';

    createDraftPage(title: string): Observable<ApiResponse<CmsPage>> {
        return this.http.post<ApiResponse<CmsPage>>(`${this.baseUrl}/pages`, { title });
    }

    getPageBySlug(slug: string): Observable<ApiResponse<CmsPage>> {
        return this.http.get<ApiResponse<CmsPage>>(`${this.baseUrl}/pages/${encodeURIComponent(slug)}`);
    }

    updateMetadata(id: string | number, payload: CmsPageMetadataUpdate): Observable<ApiResponse<CmsPage>> {
        return this.http.put<ApiResponse<CmsPage>>(`${this.baseUrl}/pages/${id}/metadata`, payload);
    }

    updateLayout(id: string | number, layout: CmsPageLayoutRow[]): Observable<ApiResponse<CmsPage>> {
        return this.http.put<ApiResponse<CmsPage>>(`${this.baseUrl}/pages/${id}/layout`, layout);
    }

    publish(id: string | number): Observable<ApiResponse<CmsPage>> {
        return this.http.post<ApiResponse<CmsPage>>(`${this.baseUrl}/pages/${id}/publish`, {});
    }

    archive(id: string | number): Observable<ApiResponse<CmsPage>> {
        return this.http.post<ApiResponse<CmsPage>>(`${this.baseUrl}/pages/${id}/archive`, {});
    }
}
