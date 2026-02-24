import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionService } from './features/auth/data-access/session-service';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { AuthService, Menu } from '@template-fullstack-client/api';

@Component({
    imports: [RouterModule, PanelMenu],
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly sessionService = inject(SessionService);
    protected readonly authService = inject(AuthService);

    readonly menu = this.sessionService.menu;
    readonly user = this.sessionService.user;

    protected title = 'backoffice';

    readonly menuItems = computed(() => {
        if (!this.menu()) return [];
        console.log(this.menu());
        return this.mapMenuItems(this.menu() ?? []);
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

    constructor() {
        this.authService.login({
            email: 'user@example.com',
            password: 'password123',
        });
    }
}
