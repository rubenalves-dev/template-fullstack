import * as _angular_core from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import { ComboboxListboxControls, ComboboxTreeControls, ComboboxDialogPattern, ComboboxPattern } from './_combobox-chunk.js';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.js';
import './_keyboard-event-manager-chunk.js';
import './_list-navigation-chunk.js';
import './_pointer-event-manager-chunk.js';
import './_list-chunk.js';

/**
 * Identifies an element as a popup for an `ngCombobox`.
 *
 * This directive acts as a bridge, allowing the `ngCombobox` to discover and interact
 * with the underlying control (e.g., `ngListbox`, `ngTree`, or `ngComboboxDialog`) that
 * manages the options. It's primarily used as a host directive and is responsible for
 * exposing the popup's control pattern to the parent combobox.
 *
 * @developerPreview 21.0
 *
 * @see [Combobox](guide/aria/combobox)
 * @see [Select](guide/aria/select)
 * @see [Multiselect](guide/aria/multiselect)
 * @see [Autocomplete](guide/aria/autocomplete)
 */
declare class ComboboxPopup<V> {
    /** The combobox that the popup belongs to. */
    readonly combobox: Combobox<V> | null;
    /** The popup controls exposed to the combobox. */
    readonly _controls: _angular_core.WritableSignal<ComboboxListboxControls<any, V> | ComboboxTreeControls<any, V> | ComboboxDialogPattern | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxPopup<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxPopup<any>, "[ngComboboxPopup]", ["ngComboboxPopup"], {}, {}, never, never, true, never>;
}

/**
 * The container element that wraps a combobox input and popup, and orchestrates its behavior.
 *
 * The `ngCombobox` directive is the main entry point for creating a combobox and customizing its
 * behavior. It coordinates the interactions between the `ngComboboxInput` and the popup, which
 * is defined by a `ng-template` with the `ngComboboxPopupContainer` directive. If using the
 * `CdkOverlay`, the `cdkConnectedOverlay` directive takes the place of `ngComboboxPopupContainer`.
 *
 * ```html
 * <div ngCombobox filterMode="highlight">
 *   <input
 *     ngComboboxInput
 *     placeholder="Search for a state..."
 *     [(value)]="searchString"
 *   />
 *
 *   <ng-template ngComboboxPopupContainer>
 *     <div ngListbox [(value)]="selectedValue">
 *       @for (option of filteredOptions(); track option) {
 *         <div ngOption [value]="option" [label]="option">
 *           <span>{{option}}</span>
 *         </div>
 *       }
 *     </div>
 *   </ng-template>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Combobox](guide/aria/combobox)
 * @see [Select](guide/aria/select)
 * @see [Multiselect](guide/aria/multiselect)
 * @see [Autocomplete](guide/aria/autocomplete)
 */
declare class Combobox<V> {
    /** A signal wrapper for directionality. */
    protected textDirection: _angular_core.Signal<_angular_cdk_bidi.Direction>;
    /** The element that the combobox is attached to. */
    private readonly _elementRef;
    /** A reference to the combobox element. */
    readonly element: HTMLElement;
    /** The DeferredContentAware host directive. */
    private readonly _deferredContentAware;
    /** The combobox popup. */
    readonly popup: _angular_core.Signal<ComboboxPopup<V> | undefined>;
    /**
     * The filter mode for the combobox.
     * - `manual`: The consumer is responsible for filtering the options.
     * - `auto-select`: The combobox automatically selects the first matching option.
     * - `highlight`: The combobox highlights matching text in the options without changing selection.
     */
    filterMode: _angular_core.InputSignal<"manual" | "auto-select" | "highlight">;
    /** Whether the combobox is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the combobox is read-only. */
    readonly readonly: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The value of the first matching item in the popup. */
    readonly firstMatch: _angular_core.InputSignal<V | undefined>;
    /** Whether the combobox is expanded. */
    readonly expanded: _angular_core.Signal<boolean>;
    /** Whether the combobox popup should always be expanded, regardless of user interaction. */
    readonly alwaysExpanded: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Input element connected to the combobox, if any. */
    readonly inputElement: _angular_core.Signal<HTMLInputElement | undefined>;
    /** The combobox ui pattern. */
    readonly _pattern: ComboboxPattern<any, V>;
    constructor();
    /** Opens the combobox to the selected item. */
    open(): void;
    /** Closes the combobox. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Combobox<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Combobox<any>, "[ngCombobox]", ["ngCombobox"], { "filterMode": { "alias": "filterMode"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "readonly": { "alias": "readonly"; "required": false; "isSignal": true; }; "firstMatch": { "alias": "firstMatch"; "required": false; "isSignal": true; }; "alwaysExpanded": { "alias": "alwaysExpanded"; "required": false; "isSignal": true; }; }, {}, ["popup"], never, true, [{ directive: typeof DeferredContentAware; inputs: { "preserveContent": "preserveContent"; }; outputs: {}; }]>;
}

/**
 * Integrates a native `<dialog>` element with the combobox, allowing for
 * a modal or non-modal popup experience. It handles the opening and closing of the dialog
 * based on the combobox's expanded state.
 *
 * ```html
 * <ng-template ngComboboxPopupContainer>
 *   <dialog ngComboboxDialog class="example-dialog">
 *     <!-- ... dialog content ... -->
 *   </dialog>
 * </ng-template>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Combobox](guide/aria/combobox)
 * @see [Select](guide/aria/select)
 * @see [Multiselect](guide/aria/multiselect)
 * @see [Autocomplete](guide/aria/autocomplete)
 */
declare class ComboboxDialog {
    /** The dialog element. */
    private readonly _elementRef;
    /** A reference to the dialog element. */
    readonly element: HTMLElement;
    /** The combobox that the dialog belongs to. */
    readonly combobox: Combobox<any>;
    /** A reference to the parent combobox popup, if one exists. */
    private readonly _popup;
    _pattern: ComboboxDialogPattern;
    constructor();
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxDialog, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxDialog, "dialog[ngComboboxDialog]", ["ngComboboxDialog"], {}, {}, never, never, true, [{ directive: typeof ComboboxPopup; inputs: {}; outputs: {}; }]>;
}

/**
 * An input that is part of a combobox. It is responsible for displaying the
 * current value and handling user input for filtering and selection.
 *
 * This directive should be applied to an `<input>` element within an `ngCombobox`
 * container. It automatically handles keyboard interactions, such as opening the
 * popup and navigating through the options.
 *
 * ```html
 * <input
 *   ngComboboxInput
 *   placeholder="Search..."
 *   [(value)]="searchString"
 * />
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Combobox](guide/aria/combobox)
 * @see [Select](guide/aria/select)
 * @see [Multiselect](guide/aria/multiselect)
 * @see [Autocomplete](guide/aria/autocomplete)
 */
declare class ComboboxInput {
    /** The element that the combobox is attached to. */
    private readonly _elementRef;
    /** A reference to the input element. */
    readonly element: HTMLElement;
    /** The combobox that the input belongs to. */
    readonly combobox: Combobox<any>;
    /** The value of the input. */
    value: _angular_core.ModelSignal<string>;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxInput, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxInput, "input[ngComboboxInput]", ["ngComboboxInput"], { "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; }, never, never, true, never>;
}

/**
 * A structural directive that marks the `ng-template` to be used as the popup
 * for a combobox. This content is conditionally rendered.
 *
 * The content of the popup can be a `ngListbox`, `ngTree`, or `role="dialog"`, allowing for
 * flexible and complex combobox implementations. The consumer is responsible for
 * implementing the filtering logic based on the `ngComboboxInput`'s value.
 *
 * ```html
 * <ng-template ngComboboxPopupContainer>
 *   <div ngListbox [(value)]="selectedValue">
 *     <!-- ... options ... -->
 *   </div>
 * </ng-template>
 * ```
 *
 * When using CdkOverlay, this directive can be replaced by `cdkConnectedOverlay`.
 *
 * ```html
 * <ng-template
 *     [cdkConnectedOverlay]="{origin: inputElement, usePopover: 'inline' matchWidth: true}"
 *     [cdkConnectedOverlayOpen]="combobox.expanded()">
 *   <div ngListbox [(value)]="selectedValue">
 *     <!-- ... options ... -->
 *   </div>
 * </ng-template>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Combobox](guide/aria/combobox)
 * @see [Select](guide/aria/select)
 * @see [Multiselect](guide/aria/multiselect)
 * @see [Autocomplete](guide/aria/autocomplete)
 */
declare class ComboboxPopupContainer {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxPopupContainer, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxPopupContainer, "ng-template[ngComboboxPopupContainer]", ["ngComboboxPopupContainer"], {}, {}, never, never, true, [{ directive: typeof DeferredContent; inputs: {}; outputs: {}; }]>;
}

export { Combobox, ComboboxDialog, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
