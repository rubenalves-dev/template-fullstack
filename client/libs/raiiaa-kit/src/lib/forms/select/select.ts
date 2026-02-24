import {
    afterRenderEffect,
    Component,
    computed,
    contentChild,
    effect,
    input,
    signal,
    TemplateRef,
    viewChild,
    viewChildren,
} from '@angular/core';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopupContainer,
} from '@angular/aria/combobox';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Listbox, Option } from '@angular/aria/listbox';
import { ControlValueAccessor } from '@angular/forms';
import { SelectItem } from '../../shared/types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'r-select',
    imports: [
        Combobox,
        ComboboxInput,
        ComboboxPopupContainer,
        CdkConnectedOverlay,
        Listbox,
        Option,
        NgTemplateOutlet,
    ],
    templateUrl: './select.html',
    styleUrl: './select.css',
})
export class Select<T = unknown> implements ControlValueAccessor {
    // Inputs, Outputs & Content
    items = input<SelectItem<T>[]>([]);
    placeholder = input<string>('Select an option');
    optionTemplate = contentChild<TemplateRef<unknown>>('optionTmp');
    selectedTemplate = contentChild<TemplateRef<unknown>>('selectedTmp');

    // Views
    listbox = viewChild(Listbox);
    options = viewChildren(Option);
    combobox = viewChild(Combobox);

    // Signals
    value = signal<unknown>(null);
    disabled = signal(false);

    // Computed Values
    selectedItem = computed(() => {
        const val = this.value();
        return this.items().find((item) => item.value === val);
    });

    // ControlValueAccessor
    onChange: any = () => {
        /* empty */
    };
    onTouched: any = () => {
        /* empty */
    };

    constructor() {
        const listbox = this.listbox();
        if (!listbox) return;

        const selectedValues = listbox.values();
        const newVal = selectedValues[0];

        if (newVal !== this.value()) {
            this.value.set(newVal);
            this.onChange(newVal);
            this.onTouched();
            this.combobox()?.close();
        }

        effect(() => {
            const items = this.items();
            if (this.value() === null) {
                const defaultItem = items.find((i) => i.selected);
                if (defaultItem) {
                    this.writeValue(defaultItem.value);
                }
            }
        });

        afterRenderEffect(() => {
            const option = this.options().find((option) => option.active);
            setTimeout(
                () => option?.element.scrollIntoView({ block: 'nearest' }),
                50,
            );
        });

        afterRenderEffect(() => {
            if (!this.combobox()?.expanded()) {
                setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
            }
        });
    }

    // ControlValueAccessor Interface Methods
    writeValue(obj: unknown): void {
        this.value.set(obj);
        this.listbox()?.values.set([
            obj,
            ...(this.listbox()
                ?.values()
                ?.filter((o) => o === obj) ?? []),
        ]);
    }
    registerOnChange(fn: unknown): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: unknown): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }
}
