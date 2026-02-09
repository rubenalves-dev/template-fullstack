import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'raiiaa-textarea',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './textarea.html',
    styleUrl: './textarea.scss',
})
export class TextareaComponent {
    label = input.required<string>();
    id = input.required<string>();
    control = input.required<FormControl<string>>();
    placeholder = input<string>('');
    rows = input<number>(5);
    hint = input<string | null>(null);
}
