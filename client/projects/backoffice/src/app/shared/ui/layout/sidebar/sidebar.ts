import { Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { MenuItem } from '../../../../core/menu/menu';
import { MenuStateService } from '../../../../core/menu/menu-state.service';

@Component({
    selector: 'raiiaa-sidebar',
    imports: [RouterLink, LucideAngularModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private menuStateService = inject(MenuStateService);

    menuItems = input.required<MenuItem[]>();
    expandedItems = this.menuStateService.expandedItems;

    toggleSubmenu(itemId: string): void {
        this.menuStateService.toggle(itemId);
    }

    isExpanded(itemId: string): boolean {
        console.log('Checking if item is expanded:', itemId);
        return this.menuStateService.isExpanded(itemId);
    }

    constructor() {
        effect(() => {
            console.log('Expanded items:', this.expandedItems());
        });
    }
}
