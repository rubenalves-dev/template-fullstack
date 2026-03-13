import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLayout } from './page-layout';
import { ActivatedRoute } from '@angular/router';
import { CmsService } from '@template-fullstack-client/api';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PageLayout', () => {
    let component: PageLayout;
    let fixture: ComponentFixture<PageLayout>;
    let mockCmsService: any;
    let mockActivatedRoute: any;

    beforeEach(async () => {
        mockCmsService = {
            getPageBySlug: vi.fn().mockReturnValue(of({ title: 'Test Page', layout: [] })),
        };

        mockActivatedRoute = {
            snapshot: {
                params: { slug: 'test-page' },
            },
        };

        await TestBed.configureTestingModule({
            imports: [PageLayout, NoopAnimationsModule],
            providers: [
                { provide: CmsService, useValue: mockCmsService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PageLayout);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch page on init', () => {
        expect(mockCmsService.getPageBySlug).toHaveBeenCalledWith('test-page');
        expect(component.page()).toEqual({ title: 'Test Page', layout: [] });
    });
});
