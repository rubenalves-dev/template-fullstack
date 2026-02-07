import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NotificationComponent} from 'shared';
import {Sidebar} from './shared/ui/layout/sidebar/sidebar';
import {MenuService} from './core/menu/menu-service';

@Component({
  selector: 'raiiaa-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App  implements OnInit {
  protected readonly menuService = inject(MenuService);

  protected readonly title = signal('backoffice');

  ngOnInit(): void {
    this.menuService.loadMenu();
  }
}
