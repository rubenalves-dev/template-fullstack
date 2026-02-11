import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../../core/api/api-client';
import { CMS_API_BASE_URL, CmsService } from './cms-service';
import {
    CreateDraftPageRequest,
    Page,
    PageDetail,
    PageRow,
    UpdatePageMetadataRequest,
} from './dtos';

describe('CmsService', () => {
    let service: CmsService;
    let apiClient: ApiClient;
    const baseUrl = 'https://api.example.com';

    beforeEach(() => {
        const apiClientMock = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                CmsService,
                { provide: ApiClient, useValue: apiClientMock },
                { provide: CMS_API_BASE_URL, useValue: baseUrl },
            ],
        });

        service = TestBed.inject(CmsService);
        apiClient = TestBed.inject(ApiClient);
    });

    describe('initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('getPages', () => {
        it('should fetch all pages', async () => {
            const mockPages: Page[] = [
                {
                    id: 'page-1',
                    title: 'Home',
                    slug: 'home',
                    seo_description: 'Home page',
                    seo_keywords: 'home',
                    status: 'published',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-02T00:00:00Z',
                },
                {
                    id: 'page-2',
                    title: 'About',
                    slug: 'about',
                    seo_description: 'About page',
                    seo_keywords: 'about',
                    status: 'draft',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-02T00:00:00Z',
                },
            ];

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockPages));

            const pages = await lastValueFrom(service.getPages());

            expect(pages).toEqual(mockPages);
            expect(pages).toHaveLength(2);
            expect(apiClientMock.get).toHaveBeenCalledWith(`${baseUrl}/pages`);
        });

        it('should return empty array when no pages exist', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of([]));

            const pages = await lastValueFrom(service.getPages());

            expect(pages).toEqual([]);
        });

        it('should handle pages with null SEO fields', async () => {
            const mockPages: Page[] = [
                {
                    id: 'page-3',
                    title: 'Test',
                    slug: 'test',
                    seo_description: null,
                    seo_keywords: null,
                    status: 'draft',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-02T00:00:00Z',
                },
            ];

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockPages));

            const pages = await lastValueFrom(service.getPages());

            expect(pages[0].seo_description).toBeNull();
            expect(pages[0].seo_keywords).toBeNull();
        });

        it('should handle error when fetching pages', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(throwError(() => new Error('Server error')));

            await expect(lastValueFrom(service.getPages())).rejects.toThrow('Server error');
        });
    });

    describe('getPageBySlug', () => {
        it('should fetch page by slug', async () => {
            const mockPage: PageDetail = {
                id: 'page-1',
                title: 'Home',
                slug: 'home',
                seo_description: 'Home page',
                seo_keywords: 'home',
                status: 'published',
                layout: [],
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-02T00:00:00Z',
            };

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockPage));

            const page = await lastValueFrom(service.getPageBySlug('home'));

            expect(page).toEqual(mockPage);
            expect(apiClientMock.get).toHaveBeenCalledWith(`${baseUrl}/pages/home`);
        });

        it('should handle slug with special characters', async () => {
            const mockPage: PageDetail = {
                id: 'page-2',
                title: 'FAQ',
                slug: 'faq-questions',
                seo_description: 'FAQ',
                seo_keywords: 'faq',
                status: 'published',
                layout: [],
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-02T00:00:00Z',
            };

            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(of(mockPage));

            const page = await lastValueFrom(service.getPageBySlug('faq-questions'));

            expect(page.slug).toBe('faq-questions');
        });

        it('should handle error when page not found', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(throwError(() => new Error('Not found')));

            await expect(lastValueFrom(service.getPageBySlug('non-existent'))).rejects.toThrow(
                'Not found',
            );
        });
    });

    describe('createDraftPage', () => {
        it('should create a new draft page', async () => {
            const request: CreateDraftPageRequest = {
                title: 'New Page',
            };

            const mockPage: Page = {
                id: 'page-3',
                title: 'New Page',
                slug: 'new-page',
                seo_description: null,
                seo_keywords: null,
                status: 'draft',
                created_at: '2024-01-03T00:00:00Z',
                updated_at: '2024-01-03T00:00:00Z',
            };

            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of(mockPage));

            const page = await lastValueFrom(service.createDraftPage(request));

            expect(page).toEqual(mockPage);
            expect(page.status).toBe('draft');
            expect(apiClientMock.post).toHaveBeenCalledWith(`${baseUrl}/pages`, request);
        });

        it('should create page with only title', async () => {
            const request: CreateDraftPageRequest = {
                title: 'Simple Page',
            };

            const mockPage: Page = {
                id: 'page-4',
                title: 'Simple Page',
                slug: 'simple-page',
                seo_description: null,
                seo_keywords: null,
                status: 'draft',
                created_at: '2024-01-03T00:00:00Z',
                updated_at: '2024-01-03T00:00:00Z',
            };

            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of(mockPage));

            const page = await lastValueFrom(service.createDraftPage(request));

            expect(page.title).toBe('Simple Page');
            expect(page.slug).toBe('simple-page');
        });
    });

    describe('updatePageMetadata', () => {
        it('should update page metadata', async () => {
            const request: UpdatePageMetadataRequest = {
                title: 'Updated Title',
                seo_description: 'Updated description',
                keywords: ['keyword1', 'keyword2'],
            };

            const apiClientMock = apiClient as any;
            apiClientMock.put.mockReturnValue(of({}));

            const response = await lastValueFrom(service.updatePageMetadata('page-1', request));

            expect(response).toEqual({});
            expect(apiClientMock.put).toHaveBeenCalledWith(
                `${baseUrl}/pages/page-1/metadata`,
                request,
            );
        });

        it('should update only title', async () => {
            const request: UpdatePageMetadataRequest = {
                title: 'New Title Only',
            };

            const apiClientMock = apiClient as any;
            apiClientMock.put.mockReturnValue(of({}));

            await lastValueFrom(service.updatePageMetadata('page-2', request));

            expect(apiClientMock.put).toHaveBeenCalledWith(
                `${baseUrl}/pages/page-2/metadata`,
                request,
            );
        });

        it('should update with keywords array', async () => {
            const request: UpdatePageMetadataRequest = {
                keywords: ['seo', 'optimization', 'angular'],
            };

            const apiClientMock = apiClient as any;
            apiClientMock.put.mockReturnValue(of({}));

            await lastValueFrom(service.updatePageMetadata('page-3', request));

            expect(apiClientMock.put).toHaveBeenCalledWith(`${baseUrl}/pages/page-3/metadata`, {
                keywords: ['seo', 'optimization', 'angular'],
            });
        });
    });

    describe('updatePageLayout', () => {
        it('should update page layout', async () => {
            const layout: PageRow[] = [
                {
                    sort_order: 0,
                    columns: [
                        {
                            width_md: 'col-12',
                            blocks: [],
                        },
                    ],
                },
            ];

            const apiClientMock = apiClient as any;
            apiClientMock.put.mockReturnValue(of({}));

            const response = await lastValueFrom(service.updatePageLayout('page-1', layout));

            expect(response).toEqual({});
            expect(apiClientMock.put).toHaveBeenCalledWith(
                `${baseUrl}/pages/page-1/layout`,
                layout,
            );
        });

        it('should update with empty layout', async () => {
            const layout: PageRow[] = [];

            const apiClientMock = apiClient as any;
            apiClientMock.put.mockReturnValue(of({}));

            await lastValueFrom(service.updatePageLayout('page-2', layout));

            expect(apiClientMock.put).toHaveBeenCalledWith(`${baseUrl}/pages/page-2/layout`, []);
        });

        it('should update complex layout with multiple rows and columns', async () => {
            const layout: PageRow[] = [
                {
                    sort_order: 0,
                    css_class: 'header-row',
                    columns: [
                        { width_md: 'col-md-6', blocks: [] },
                        { width_md: 'col-md-6', blocks: [] },
                    ],
                },
                {
                    sort_order: 1,
                    columns: [
                        {
                            width_md: 'col-12',
                            blocks: [
                                {
                                    type: 'text',
                                    content: { text: 'Hello World' },
                                },
                            ],
                        },
                    ],
                },
            ];

            const apiClientMock = apiClient as any;
            apiClientMock.put.mockReturnValue(of({}));

            await lastValueFrom(service.updatePageLayout('page-3', layout));

            const callArgs = apiClientMock.put.mock.calls[0][1];
            expect(callArgs).toHaveLength(2);
            expect(callArgs[0].columns).toHaveLength(2);
            expect(callArgs[1].columns[0].blocks).toHaveLength(1);
        });
    });

    describe('publishPage', () => {
        it('should publish a page', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of({}));

            const response = await lastValueFrom(service.publishPage('page-1'));

            expect(response).toEqual({});
            expect(apiClientMock.post).toHaveBeenCalledWith(`${baseUrl}/pages/page-1/publish`, {});
        });
    });

    describe('archivePage', () => {
        it('should archive a page', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.post.mockReturnValue(of({}));

            const response = await lastValueFrom(service.archivePage('page-1'));

            expect(response).toEqual({});
            expect(apiClientMock.post).toHaveBeenCalledWith(`${baseUrl}/pages/page-1/archive`, {});
        });
    });

    describe('error handling', () => {
        it('should handle network errors', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.get.mockReturnValue(throwError(() => new Error('Network error')));

            await expect(lastValueFrom(service.getPages())).rejects.toThrow('Network error');
        });

        it('should handle server errors on update operations', async () => {
            const apiClientMock = apiClient as any;
            apiClientMock.put.mockReturnValue(throwError(() => new Error('Internal server error')));

            const request: UpdatePageMetadataRequest = { title: 'Test' };

            await expect(
                lastValueFrom(service.updatePageMetadata('page-1', request)),
            ).rejects.toThrow('Internal server error');
        });
    });
});
