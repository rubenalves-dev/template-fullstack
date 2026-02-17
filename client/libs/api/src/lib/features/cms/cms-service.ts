import { Injectable, InjectionToken, inject } from '@angular/core';
import { ApiClient } from '../../core/api/api-client';

import {
    CreateDraftPageRequest,
    Page,
    PageDetail,
    PageRow,
    UpdatePageMetadataRequest,
} from './dtos';

export const CMS_API_BASE_URL = new InjectionToken<string>('CMS_API_BASE_URL', {
    factory: () => '',
});

/**
 * Full CMS service for backoffice with all administrative endpoints.
 * Frontoffice apps should use CmsPublicService instead.
 */
@Injectable({
    providedIn: 'root',
})
export class CmsService {
    private readonly api = inject(ApiClient);
    private readonly baseUrl = inject(CMS_API_BASE_URL);

    /**
     * Get all pages with basic metadata.
     * Returns: id, title, slug, seo_description, seo_keywords, status, created_at, updated_at
     */
    getPages() {
        return this.api.get<Page[]>(`${this.baseUrl}/pages`);
    }

    /**
     * Get a page by its slug with full details including layout.
     */
    getPageBySlug(slug: string) {
        return this.api.get<PageDetail>(`${this.baseUrl}/pages/${slug}`);
    }

    /**
     * Create a new draft page.
     */
    createDraftPage(request: CreateDraftPageRequest) {
        return this.api.post<Page>(`${this.baseUrl}/pages`, request);
    }

    /**
     * Update page metadata (title, SEO description, keywords).
     */
    updatePageMetadata(pageId: string, request: UpdatePageMetadataRequest) {
        return this.api.put<unknown>(`${this.baseUrl}/pages/${pageId}/metadata`, request);
    }

    /**
     * Update page layout (rows, columns, blocks).
     */
    updatePageLayout(pageId: string, layout: PageRow[]) {
        return this.api.put<unknown>(`${this.baseUrl}/pages/${pageId}/layout`, layout);
    }

    /**
     * Publish a page.
     */
    publishPage(pageId: string) {
        return this.api.post<unknown>(`${this.baseUrl}/pages/${pageId}/publish`, {});
    }

    /**
     * Archive a page.
     */
    archivePage(pageId: string) {
        return this.api.post<unknown>(`${this.baseUrl}/pages/${pageId}/archive`, {});
    }
}
