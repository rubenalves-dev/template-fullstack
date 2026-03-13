import { CommonModule } from '@angular/common';
import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    CmsService,
    PageColumn,
    PageDetail,
    PageRow,
} from '@template-fullstack-client/api';
import { Accordion } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Panel } from 'primeng/panel';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-page-layout',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Button,
        Drawer,
        Accordion,
        Panel,
        Tooltip,
        InputText,
        Toast,
    ],
    providers: [MessageService],
    templateUrl: './page-layout.html',
    styleUrl: './page-layout.css',
})
export class PageLayout {
    private readonly cmsService = inject(CmsService);
    private readonly messageService = inject(MessageService);
    private readonly activatedRoute = inject(ActivatedRoute);

    readonly page = signal<PageDetail | null>(null);
    readonly isComponentsVisible = model(false);
    readonly isPropertiesVisible = model(false);
    readonly selectedBlock = signal<any>(null);
    readonly activeColumn = signal<PageColumn | null>(null);

    // Mock available components for the picker
    readonly availableComponents = signal([
        { type: 'hero', label: 'Hero Section', icon: 'pi pi-image' },
        { type: 'text', label: 'Text Block', icon: 'pi pi-align-left' },
        { type: 'gallery', label: 'Image Gallery', icon: 'pi pi-images' },
        { type: 'cta', label: 'Call to Action', icon: 'pi pi-external-link' },
    ]);

    constructor() {
        const slug = this.activatedRoute.snapshot.params['slug'];
        if (slug) {
            this.cmsService.getPageBySlug(slug).subscribe({
                next: (page) => {
                    this.page.set(page as PageDetail);
                    console.log('Page fetched successfully:', page);
                },
                error: (err) => {
                    console.error('Error fetching page:', err);
                },
            });
        }
    }

    addRow() {
        const currentPage = this.page();
        if (!currentPage) return;

        const newRow: PageRow = {
            sort_order: (currentPage.rows?.length || 0) + 1,
            columns: [
                {
                    width_md: '100%',
                    blocks: [],
                },
            ],
        };

        this.page.set({
            ...currentPage,
            rows: [...(currentPage.rows || []), newRow],
        });
    }

    deleteRow(index: number) {
        const p = this.page();
        if (!p) return;
        const rows = [...p.rows];
        rows.splice(index, 1);
        this.page.set({ ...p, rows });
    }

    addColumn(row: PageRow) {
        row.columns.push({
            width_md: '50%',
            blocks: [],
        });
        this.page.set({ ...this.page()! });
    }

    deleteColumn(row: PageRow, colIndex: number) {
        row.columns.splice(colIndex, 1);
        if (row.columns.length === 0) {
            // Optional: delete row if no columns?
        }
        this.page.set({ ...this.page()! });
    }

    selectBlock(block: any) {
        this.selectedBlock.set(block);
        this.isPropertiesVisible.set(true);
    }

    prepareAddBlock(column: PageColumn) {
        this.activeColumn.set(column);
        this.isComponentsVisible.set(true);
    }

    addBlockToColumn(blockType: string) {
        const column = this.activeColumn();
        if (!column) {
            // If no active column, maybe add to the first column of the last row
            const p = this.page();
            if (p && p.rows.length > 0 && p.rows[0].columns.length > 0) {
                p.rows[0].columns[0].blocks.push({
                    type: blockType,
                    content: {},
                });
                this.page.set({ ...p });
            }
            return;
        }

        column.blocks.push({
            type: blockType,
            content: {},
        });
        this.page.set({ ...this.page()! });
    }

    deleteBlock(column: PageColumn, blockIndex: number) {
        column.blocks.splice(blockIndex, 1);
        this.selectedBlock.set(null);
        this.page.set({ ...this.page()! });
    }

    saveLayout() {
        const pageId = this.page()?.id;
        const rows = this.page()?.rows || [];

        if (!pageId || !rows) return;
        this.cmsService.updatePageLayout(pageId, rows).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Layout saved successfully',
                });
            },
            error: (err) => {
                console.error('Error saving layout:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save layout',
                });
            },
        });
    }
}
