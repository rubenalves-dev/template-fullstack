import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';

import {
  CreateDraftPageRequest,
  CreatePageResponse,
  PageDetailResponse,
  PageListResponse,
  PageRow,
  UpdatePageMetadataRequest,
  UpdatePageResponse,
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
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(CMS_API_BASE_URL);

  /**
   * Get all pages with basic metadata.
   * Returns: id, title, slug, seo_description, seo_keywords, status, created_at, updated_at
   */
  getPages() {
    return this.http.get<PageListResponse>(`${this.baseUrl}/pages`);
  }

  /**
   * Get a page by its slug with full details including layout.
   */
  getPageBySlug(slug: string) {
    return this.http.get<PageDetailResponse>(`${this.baseUrl}/pages/${slug}`);
  }

  /**
   * Create a new draft page.
   */
  createDraftPage(request: CreateDraftPageRequest) {
    return this.http.post<CreatePageResponse>(`${this.baseUrl}/pages`, request);
  }

  /**
   * Update page metadata (title, SEO description, keywords).
   */
  updatePageMetadata(pageId: string, request: UpdatePageMetadataRequest) {
    return this.http.put<UpdatePageResponse>(
      `${this.baseUrl}/pages/${pageId}/metadata`,
      request,
    );
  }

  /**
   * Update page layout (rows, columns, blocks).
   */
  updatePageLayout(pageId: string, layout: PageRow[]) {
    return this.http.put<UpdatePageResponse>(`${this.baseUrl}/pages/${pageId}/layout`, layout);
  }

  /**
   * Publish a page.
   */
  publishPage(pageId: string) {
    return this.http.post<UpdatePageResponse>(`${this.baseUrl}/pages/${pageId}/publish`, {});
  }

  /**
   * Archive a page.
   */
  archivePage(pageId: string) {
    return this.http.post<UpdatePageResponse>(`${this.baseUrl}/pages/${pageId}/archive`, {});
  }
}
