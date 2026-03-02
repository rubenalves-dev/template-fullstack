import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '@template-fullstack-client/api';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Menu as PMenu } from 'primeng/menu';
import { PanelMenu } from 'primeng/panelmenu';
import { SessionService } from '../../../../features/auth/data-access/session-service';

@Component({
    selector: 'app-admin-layout',
    imports: [PanelMenu, PMenu, RouterOutlet, AvatarModule, Button],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css',
})
export class AdminLayout {
    protected readonly sessionService = inject(SessionService);

    readonly menu = this.sessionService.menu;
    readonly menuItems = computed(() => {
        if (!this.menu()) return [];
        const mapped = this.mapMenuItems(this.menu() ?? []);
        return mapped;
    });

    readonly optionsItems = computed(() => {
        return [
            {
                label: 'Profile',
                icon: 'pi pi-user',
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

    mapMenuItems(items: Menu[]): MenuItem[] {
        return items.map((item) => {
            return {
                label: item.label,
                routerLink: item.path,
                icon: item.icon,
                items:
                    (item.children?.length ?? 0) > 0
                        ? this.mapMenuItems(item.children || [])
                        : null,
            } as MenuItem;
        });
    }
}
