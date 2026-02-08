import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from 'shared';
import { MenuService } from '../../../core/menu/menu-service';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';

@Component({
    selector: 'raiiaa-layout',
    imports: [RouterOutlet, Sidebar, Header, NotificationComponent],
    templateUrl: './layout.html',
    styleUrl: './layout.scss',
})
export class Layout {
    protected readonly MenuService = inject(MenuService);
}
