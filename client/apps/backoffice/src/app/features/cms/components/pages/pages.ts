import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CmsService, Page } from '@template-fullstack-client/api';
import { Logger } from '../../../../core/logger/logger';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-pages',
    imports: [TableModule, Button],
    templateUrl: './pages.html',
    styleUrl: './pages.css',
})
export class Pages implements OnInit {
    private readonly cmsService = inject(CmsService);
    private readonly logger = inject(Logger);

    readonly pages = this.cmsService.pages;

    ngOnInit(): void {
        this.cmsService.getPages().subscribe({
            next: (res) => {
                this.logger.info('Pages:', res);
            },
            error: (err) => {
                this.logger.error('Error fetching pages:', err);
            },
        });
    }

    editPage(page: Page) {
        this.logger.info('Edit page:', page);
    }

    deletePage(page: Page) {
        this.logger.info('Delete page:', page);
    }
}
