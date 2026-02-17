import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'r-select',
    imports: [],
    templateUrl: './select.html',
    styleUrl: './select.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {}
