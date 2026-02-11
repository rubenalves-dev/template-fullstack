import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';

import { PageDetailResponse } from './dtos';

export const CMS_PUBLIC_API_BASE_URL = new InjectionToken<string>('CMS_PUBLIC_API_BASE_URL', {
    factory: () => '',
});

@Injectable({
    providedIn: 'root',
})
export class CmsPublicService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(CMS_PUBLIC_API_BASE_URL);

    /**
     * Get a published page by its slug.
     * This is the only CMS endpoint available to frontoffice.
     */
    getPageBySlug(slug: string) {
        return this.http.get<PageDetailResponse>(`${this.baseUrl}/pages/${slug}`);
    }
}
