import { inject, Injectable, InjectionToken, signal } from '@angular/core';
import { ApiClient } from '../../core/api/api-client';

import {
    CreateDraftPageRequest,
    Page,
    PageDetail,
    PageRow,
    UpdatePageMetadataRequest,
} from './dtos';
import { tap } from 'rxjs';

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

    private readonly pagesSignal = signal<Page[]>([]);
    readonly pages = this.pagesSignal.asReadonly();

    /**
     * Get all pages with basic metadata.
     * Returns: id, title, slug, seo_description, seo_keywords, status, created_at, updated_at
     */
    getPages() {
        return this.api
            .get<Page[]>(`${this.baseUrl}/pages`)
            .pipe(tap((pages) => this.pagesSignal.set(pages)));
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
        return this.api.post<Page>(`${this.baseUrl}/pages`, request).pipe(
            tap((page) => {
                this.pagesSignal.update((prev) => [...prev, page]);
            }),
        );
    }

    /**
     * Update page metadata (title, SEO description, keywords).
     */
    updatePageMetadata(pageId: string, request: UpdatePageMetadataRequest) {
        return this.api
            .put<unknown>(`${this.baseUrl}/pages/${pageId}/metadata`, request)
            .pipe(
                tap((_) =>
                    this.updatePagesSignal(pageId, (page) => {
                        page.seo_keywords =
                            request.keywords ?? page.seo_keywords;
                        page.seo_description =
                            request.seo_description ?? page.seo_description;
                        page.title = request.title ?? page.title;
                    }),
                ),
            );
    }

    /**
     * Update page layout (rows, columns, blocks).
     */
    updatePageLayout(pageId: string, layout: PageRow[]) {
        return this.api.put<unknown>(
            `${this.baseUrl}/pages/${pageId}/layout`,
            layout,
        );
    }

    /**
     * Publish a page.
     */
    publishPage(pageId: string) {
        return this.api.post<unknown>(
            `${this.baseUrl}/pages/${pageId}/publish`,
            {},
        );
    }

    /**
     * Archive a page.
     */
    archivePage(pageId: string) {
        return this.api.post<unknown>(
            `${this.baseUrl}/pages/${pageId}/archive`,
            {},
        );
    }

    private updatePagesSignal(
        pageId: string,
        mapExpression: (page: Page) => void,
    ) {
        const updatedPage = this.pagesSignal().find((p) => p.id === pageId);
        if (updatedPage) {
            this.pagesSignal.update((prev) =>
                prev.map((page) => {
                    if (page.id === pageId && updatedPage) {
                        mapExpression(updatedPage);
                        return updatedPage;
                    }
                    return page;
                }),
            );
        }
    }
}
