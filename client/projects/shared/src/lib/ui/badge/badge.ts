import { Component, input } from '@angular/core';

type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md';

@Component({
    selector: 'raiiaa-badge',
    standalone: true,
    templateUrl: './badge.html',
    styleUrl: './badge.scss',
})
export class BadgeComponent {
    label = input<string | null>(null);
    variant = input<BadgeVariant>('neutral');
    size = input<BadgeSize>('md');
}
