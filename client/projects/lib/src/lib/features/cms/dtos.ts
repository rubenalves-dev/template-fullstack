import { ApiResponse } from '../auth/dtos';

// Page Statuses
export type PageStatus = 'draft' | 'published' | 'archived';

// Page Interfaces
export interface Page {
    id: string;
    title: string;
    slug: string;
    seo_description: string | null;
    seo_keywords: string | null;
    status: PageStatus;
    created_at: string;
    updated_at: string;
}

export interface PageDetail extends Page {
    layout: PageRow[];
}

// Requests
export interface CreateDraftPageRequest {
    title: string;
}

export interface UpdatePageMetadataRequest {
    title?: string;
    seo_description?: string;
    keywords?: string[];
}

// Layout Structures
export interface PageRow {
    sort_order: number;
    css_class?: string;
    columns: PageColumn[];
}

export interface PageColumn {
    width_md?: string;
    blocks: PageBlock[];
}

export interface PageBlock {
    type: string;
    content: Record<string, unknown>;
}

// Response type aliases for convenience
export type PageListResponse = ApiResponse<Page[]>;
export type PageDetailResponse = ApiResponse<PageDetail>;
export type CreatePageResponse = ApiResponse<Page>;
export type UpdatePageResponse = ApiResponse<unknown>;
