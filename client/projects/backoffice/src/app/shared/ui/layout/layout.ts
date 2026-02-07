import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from './sidebar/sidebar';
import {Header} from './header/header';
import {NotificationComponent} from 'shared';
import {Aside} from './aside/aside';

@Component({
  selector: 'raiiaa-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    Header,
    NotificationComponent,
    Aside
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
