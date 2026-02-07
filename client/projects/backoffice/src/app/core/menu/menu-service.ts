import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MenuItem} from './menu';
import {error} from 'ng-packagr/src/lib/utils/log';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly _http = inject(HttpClient);

  private _menu = signal<MenuItem[]>([]);
  readonly menu = this._menu.asReadonly();

  loadMenu() {
    this._http.get<MenuItem[]>('http://localhost:8080/backoffice/me/menu').subscribe({
      next: value => {
        console.log('Menu loaded:', value);
        this._menu.set((value as any).data)
      },
      error: err => {
        console.log('Failed to load menu:', err);
        this.clearMenu();
      }
    });
  }

  clearMenu() {
    this._menu.set([]);
  }
}
