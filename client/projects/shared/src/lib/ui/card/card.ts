import { Component, input } from '@angular/core';

@Component({
    selector: 'raiiaa-card',
    standalone: true,
    templateUrl: './card.html',
    styleUrl: './card.scss',
})
export class CardComponent {
    title = input<string | null>(null);
    subtitle = input<string | null>(null);
    padded = input<boolean>(true);
}
