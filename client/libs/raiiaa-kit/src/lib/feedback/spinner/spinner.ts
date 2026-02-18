import { Component, computed, input } from '@angular/core';
import { ValuesOf } from '../../shared/utils/objects';

@Component({
    selector: 'r-spinner',
    imports: [],
    templateUrl: './spinner.html',
    styleUrl: './spinner.css',
    host: {
        '[class]': 'hostClasses()',
    },
})
export class Spinner {
    theme = input<ValuesOf<typeof SpinnerTheme>>('primary');
    size = input<ValuesOf<typeof SpinnerSize>>('md');

    protected hostClasses = computed(() => {
        return `r-spinner r-spinner--${this.size()}} r-spinner--${this.theme()}`;
    });
}

export const SpinnerTheme = {
    Primary: 'primary',
    Secondary: 'secondary',
    Muted: 'muted',
    Destructive: 'destructive',
    Black: 'black',
    White: 'white',
} as const;

export const SpinnerSize = {
    ExtraSmall: 'xs',
    Small: 'sm',
    Medium: 'md',
    Large: 'lg',
} as const;
