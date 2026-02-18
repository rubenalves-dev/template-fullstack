import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ValuesOf } from '../../shared/utils/objects';

@Component({
    selector: 'input[r-input], textarea[r-input]',
    imports: [],
    templateUrl: './input.html',
    styleUrl: './input.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': 'hostClasses()',
    },
})
export class Input {
    disabled = input(false, { transform: booleanAttribute });
    readonly = input(false, { transform: booleanAttribute });

    status = input<ValuesOf<typeof InputStatus>>('idle');
    size = input<ValuesOf<typeof InputSize>>('md');

    protected hostClasses = computed(() => {
        let classes = `r-input r-input--${this.status()} r-input--${this.size()}`;
        if (this.disabled()) classes += ' r-input--disabled';
        if (this.readonly()) classes += ' r-input--readonly';
        return classes;
    });
}

export const InputStatus = {
    Idle: 'idle',
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
} as const;

export const InputSize = {
    Small: 'sm',
    Medium: 'md',
    Large: 'lg',
} as const;
