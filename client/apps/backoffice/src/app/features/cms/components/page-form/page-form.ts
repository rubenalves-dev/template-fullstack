import { Component, inject, model, output } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CmsService, Page, PageStatus } from '@template-fullstack-client/api';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { ButtonDirective } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

@Component({
    selector: 'app-page-form',
    imports: [
        ReactiveFormsModule,
        Drawer,
        InputText,
        Textarea,
        Select,
        ButtonDirective,
        AutoComplete,
        MessageModule,
    ],
    templateUrl: './page-form.html',
    styleUrl: './page-form.css',
})
export class PageForm {
    private readonly cmsService = inject(CmsService);
    private readonly messageService = inject(MessageService);

    visible = model<boolean>(false);
    rUpdate = output<Page>();
    rCreate = output<Page>();
    rChange = output<Page>();

    readonly form = new FormGroup({
        id: new FormControl<string>(''),
        title: new FormControl<string>(''),
        slug: new FormControl<string>(''),
        status: new FormControl<PageStatus>('draft'),
        seo_description: new FormControl<string>('', [
            Validators.minLength(10),
            Validators.maxLength(160),
        ]),
        seo_keywords: new FormControl<string[]>([]),
    });

    openDrawer() {
        this.visible.set(true);
    }

    closeDrawer() {
        this.visible.set(false);
    }

    toggleDrawer() {
        this.visible.set(!this.visible());
    }

    openNew() {
        this.form.reset({ status: 'draft' });
        this.openDrawer();
    }

    openEdit(id: string) {
        this.cmsService.getPageBySlug(id).subscribe({
            next: (res) => {
                this.form.patchValue(res);
                this.openDrawer();
            },
            error: (err) => {
                console.error('Error fetching page:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch page data',
                });
            },
        });
    }

    onSubmit() {
        if (this.form.value.id) {
            this.updateRequest();
        } else {
            this.createRequest();
        }
    }

    createRequest() {
        this.cmsService
            .createDraftPage({
                title: this.form.value.title ?? '',
            })
            .subscribe({
                next: (res) => {
                    this.form.patchValue(res);
                    this.rCreate.emit(res);
                    this.rChange.emit(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Page created successfully',
                    });
                },
                error: (err) => {
                    console.error('Error creating page:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create page',
                    });
                },
            });
    }

    updateRequest() {
        this.cmsService
            .updatePageMetadata(this.form.value.id ?? '', {
                title: this.form.value.title ?? '',
                seo_description: this.form.value.seo_description ?? '',
                keywords: this.form.value.seo_keywords ?? [],
            })
            .subscribe({
                next: (res) => {
                    this.rUpdate.emit(this.form.value as Page);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Page updated successfully',
                    });
                },
                error: (err) => {
                    console.error('Error updating page:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update page',
                    });
                },
            });
    }

    deleteRequest(id: string) {
        console.log('Deleting page:', id);
        this.cmsService.deletePage(id).subscribe({
            next: (res) => {
                this.rChange.emit(this.form.value as Page);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Page deleted successfully',
                });
            },
            error: (err) => {
                console.error('Error deleting page:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete page',
                });
            },
        });
    }
}
