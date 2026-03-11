import { Component, inject, OnInit } from '@angular/core';
import { CmsService, PageStatus } from '@template-fullstack-client/api';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Logger } from '../../../../core/logger/logger';
import { PageForm } from '../page-form/page-form';

@Component({
    selector: 'app-pages',
    imports: [TableModule, Button, PageForm, TagModule],
    templateUrl: './pages.html',
    styleUrl: './pages.css',
})
export class Pages implements OnInit {
    private readonly cmsService = inject(CmsService);
    private readonly logger = inject(Logger);

    readonly pages = this.cmsService.pages;

    ngOnInit(): void {
        this.fetchData();
    }

    refreshTable() {
        this.fetchData();
    }

    getPageStatusSeverity(status: PageStatus) {
        switch (status) {
            case 'draft':
                return 'warn';
            case 'published':
                return 'success';
            case 'archived':
                return 'secondary';
            default:
                return 'info';
        }
    }

    fetchData() {
        this.cmsService.getPages().subscribe({
            next: (res) => {
                this.logger.info('Pages:', res);
            },
            error: (err) => {
                this.logger.error('Error fetching pages:', err);
            },
        });
    }
}
