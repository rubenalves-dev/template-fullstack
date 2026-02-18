import { Component, signal } from '@angular/core';

@Component({
    selector: 'r-tooltip-component',
    imports: [],
    templateUrl: './tooltip-component.html',
    styleUrl: './tooltip-component.css',
})
export class TooltipComponent {
    text = signal('');
    position = signal({ top: 0, left: 0 });
}
