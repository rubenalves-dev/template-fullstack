import { Injectable, InjectionToken, inject } from '@angular/core';
import { ApiClient } from '../../core/api/api-client';

import { PageDetail } from './dtos';

export const CMS_PUBLIC_API_BASE_URL = new InjectionToken<string>('CMS_PUBLIC_API_BASE_URL', {
    factory: () => '',
});

@Injectable({
    providedIn: 'root',
})
export class CmsPublicService {
    private readonly api = inject(ApiClient);
    private readonly baseUrl = inject(CMS_PUBLIC_API_BASE_URL);

    /**
     * Get a published page by its slug.
     * This is the only CMS endpoint available to frontoffice.
     */
    getPageBySlug(slug: string) {
        return this.api.get<PageDetail>(`${this.baseUrl}/pages/${slug}`);
    }
}
