import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, isActive, PRIMARY_OUTLET, Router, RouterOutlet, UrlSegment } from '@angular/router';
import { Menu } from '@template-fullstack-client/api';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SessionService } from '../../../../features/auth/data-access/session-service';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
    selector: 'app-admin-layout',
    imports: [
        PanelMenuModule,
        MenuModule,
        RouterOutlet,
        AvatarModule,
        ButtonModule,
        Breadcrumb,
    ],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css',
})
export class AdminLayout {
    protected readonly sessionService = inject(SessionService);
    protected readonly activatedRoute = inject(ActivatedRoute);
    protected readonly router = inject(Router);

    readonly menu = this.sessionService.menu;
    readonly menuItems = computed(() => {
        return this.mapMenusToMenuItems(this.menu() ?? []);
    });

    readonly optionsItems = computed(() => {
        return [
            {
                label: 'Settings',
                icon: 'pi pi-cog',
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.sessionService.logout();
                },
            },
        ];
    });

    readonly breadcrumbItems = signal<MenuItem[]>([]);

    constructor() {
        effect(() => {
            const _ = this.router.currentNavigation();
            this.breadcrumbItems.set(this.buildBreadcrumbs());
        });
    }

    private mapMenusToMenuItems(items: Menu[]): MenuItem[] {
        return items.map((item) => {
            return {
                label: item.label,
                routerLink: item.path ? '/admin' + item.path : null,
                icon: item.icon,
                items:
                    (item.children?.length ?? 0) > 0
                        ? this.mapMenusToMenuItems(item.children || [])
                        : null,
            } as MenuItem;
        });
    }

    private buildBreadcrumbs(): MenuItem[] {
        const items: MenuItem[] = [];
        const root = this.router.routerState.snapshot.root;

        const segments: UrlSegment[] = [];
        let node = root;

        while (node) {
            if (node.url.length > 0) {
                segments.push(...node.url);
            }
            node =
                node.children.find((c) => c.outlet === PRIMARY_OUTLET) ??
                (null as never);
        }

        const consumed: string[] = [];
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];

            consumed.push(segment.path);
            const url = '/' + consumed.join('/');

            const crumb: MenuItem = {
                label: this.toLabel(segment.path),
            };
            if (this.isReachable(url) && i < segments.length - 1) {
                crumb.routerLink = url;
            }
            if (i === 0) {
                crumb.routerLink = '/';
            }
            items.push(crumb);
        }

        return items;
    }

    private toLabel(segment: string): string {
        return segment
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    private isReachable(url: string): boolean {
        return isActive(url, this.router, {
            paths: 'exact',
            fragment: 'exact',
            queryParams: 'subset',
            matrixParams: 'subset',
        })();
    }
}
