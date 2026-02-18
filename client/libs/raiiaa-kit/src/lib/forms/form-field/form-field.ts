import { Component, computed, contentChild, input } from '@angular/core';
import { Input } from '../input/input';
import { Spinner } from '../../feedback/spinner/spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, startWith, switchMap } from 'rxjs';

@Component({
    selector: 'r-form-field',
    imports: [Spinner, ReactiveFormsModule],
    templateUrl: './form-field.html',
    styleUrl: './form-field.css',
})
export class FormField {
    label = input<string>('');
    hint = input<string>('');
    errorMessage = input<string>('');
    isLoading = input(false);

    protected inputElement = contentChild(Input);
    private $control = computed(() => this.inputElement()?.ngControl);

    private validationState$ = toObservable(this.inputElement).pipe(
        switchMap((atom) => {
            const ctrl = atom?.ngControl?.control;
            if (!ctrl) return of({ status: 'VALID', errors: null });

            return ctrl.statusChanges.pipe(
                startWith(ctrl.status),
                map(() => ({
                    status: ctrl.status,
                    errors: ctrl.errors,
                })),
            );
        }),
    );
    protected state = toSignal(this.validationState$, {
        initialValue: { status: 'VALID', errors: null },
    });

    protected $labelName = computed(() => {
        if (this.label()) {
            return this.label() || null;
        }
        if (this.inputElement()?.ngControl?.name) {
            return this.inputElement()?.ngControl?.name?.toString() || null;
        }
        return null;
    });

    protected $hasErrors = computed(() => {
        if (this.isLoading()) return false;
        if (!this.inputElement()) return false;

        const control = this.$control();
        if (!control) return false;
        const ctrl = control.control;
        if (!ctrl) return false;

        const isInvalid = this.state().status === 'INVALID';
        return (isInvalid && (ctrl.dirty || ctrl.touched)) ?? false;
    });

    protected $errorMessage = computed(() => {
        if (!this.$hasErrors()) return null;

        if (this.errorMessage()) {
            return this.errorMessage();
        }

        const control = this.$control();
        if (!control) return null;

        const errors = this.state().errors;
        if (!errors) return null;

        const firstErrorKey = Object.keys(errors)[0];
        const messages: Record<string, string> = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            minlength: `Minimum length is ${errors['minlength']?.requiredLength}`,
            maxlength: `Maximum length is ${errors['maxlength']?.requiredLength}`,
        };
        return messages[firstErrorKey] || 'Invalid field';
    });
}
