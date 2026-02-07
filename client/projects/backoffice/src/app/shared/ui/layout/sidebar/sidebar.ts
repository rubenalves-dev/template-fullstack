import {Component, inject} from '@angular/core';
import {MenuService} from '../../../../core/menu/menu-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'raiiaa-sidebar',
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly menuService = inject(MenuService);
}
