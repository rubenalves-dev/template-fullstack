export interface ApiResponse<T> {
    data: T;
}

export type CmsPageStatus = 'draft' | 'published' | 'archived';

export interface CmsPage {
    id: string | number;
    title: string;
    slug: string;
    seo_description?: string;
    keywords?: string[];
    status?: CmsPageStatus;
    layout?: CmsPageLayoutRow[];
    created_at?: string;
    updated_at?: string;
}

export interface CmsPageMetadataUpdate {
    title: string;
    slug: string;
    seo_description?: string;
    keywords?: string[];
}

export interface CmsPageLayoutRow {
    sort_order: number;
    css_class?: string;
    columns: CmsPageLayoutColumn[];
}

export interface CmsPageLayoutColumn {
    width_md?: string;
    width_lg?: string;
    width_sm?: string;
    blocks: CmsPageLayoutBlock[];
}

export interface CmsPageLayoutBlock {
    type: string;
    content: Record<string, unknown>;
}
