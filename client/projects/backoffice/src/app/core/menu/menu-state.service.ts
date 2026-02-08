import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MenuStateService {
    private _expandedItems = signal<Set<string>>(new Set());
    readonly expandedItems = this._expandedItems.asReadonly();

    toggle(id: string): void {
        const current = new Set(this._expandedItems());
        current.has(id) ? current.delete(id) : current.add(id);
        this._expandedItems.set(current);
    }

    isExpanded(id: string): boolean {
        return this._expandedItems().has(id);
    }

    expand(id: string): void {
        const current = new Set(this._expandedItems());
        current.add(id);
        this._expandedItems.set(current);
    }

    collapse(id: string): void {
        const current = new Set(this._expandedItems());
        current.delete(id);
        this._expandedItems.set(current);
    }

    clear(): void {
        this._expandedItems.set(new Set());
    }
}
