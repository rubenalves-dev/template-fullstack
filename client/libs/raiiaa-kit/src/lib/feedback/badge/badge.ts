import { Component, computed, input } from '@angular/core';
import { ValuesOf } from '../../shared/utils/objects';

@Component({
    selector: 'r-badge',
    imports: [],
    templateUrl: './badge.html',
    styleUrl: './badge.css',
    host: {
        '[class]': 'hostClasses()',
    },
})
export class Badge {
    theme = input<ValuesOf<typeof BadgeTheme>>('primary');
    variant = input<ValuesOf<typeof BadgeVariant>>('solid');
    pill = input<boolean>(false);

    hostClasses = computed(() => {
        let classes = `r-badge r-badge--${this.theme()} r-badge--${this.variant()}`;
        if (this.pill()) classes += ' r-badge--pill';
        return classes;
    });
}

export const BadgeTheme = {
    Primary: 'primary',
    Secondary: 'secondary',
    Muted: 'muted',
    Destructive: 'destructive',
    Black: 'black',
    White: 'white',
} as const;

export const BadgeVariant = {
    Solid: 'solid',
    Outline: 'outline',
    Ghost: 'ghost',
} as const;
