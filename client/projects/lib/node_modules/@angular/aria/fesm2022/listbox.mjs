import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, computed, input, booleanAttribute, Directive, contentChildren, model, signal, afterRenderEffect, untracked } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { _IdGenerator } from '@angular/cdk/a11y';
import { OptionPattern, ComboboxListboxPattern, ListboxPattern } from './_combobox-listbox-chunk.mjs';
import { ComboboxPopup } from './combobox.mjs';
export { Combobox as ɵɵCombobox, ComboboxDialog as ɵɵComboboxDialog, ComboboxInput as ɵɵComboboxInput, ComboboxPopupContainer as ɵɵComboboxPopupContainer } from './combobox.mjs';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_list-chunk.mjs';
import './_list-navigation-chunk.mjs';
import './_list-typeahead-chunk.mjs';
import './_pointer-event-manager-chunk.mjs';
import './_deferred-content-chunk.mjs';
import './_combobox-chunk.mjs';

const LISTBOX = new InjectionToken('LISTBOX');

class Option {
  element = inject(ElementRef).nativeElement;
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  _listbox = inject(LISTBOX);
  id = input(inject(_IdGenerator).getId('ng-option-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  searchTerm = computed(() => this.label() ?? this.element.textContent, ...(ngDevMode ? [{
    debugName: "searchTerm"
  }] : []));
  _listboxPattern = computed(() => this._listbox._pattern, ...(ngDevMode ? [{
    debugName: "_listboxPattern"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  label = input(...(ngDevMode ? [undefined, {
    debugName: "label"
  }] : []));
  selected = computed(() => this._pattern.selected(), ...(ngDevMode ? [{
    debugName: "selected"
  }] : []));
  _pattern = new OptionPattern({
    ...this,
    id: this.id,
    value: this.value,
    listbox: this._listboxPattern,
    element: () => this.element,
    searchTerm: () => this.searchTerm() ?? ''
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Option,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: Option,
    isStandalone: true,
    selector: "[ngOption]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      label: {
        classPropertyName: "label",
        publicName: "label",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "option"
      },
      properties: {
        "attr.data-active": "active()",
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-selected": "_pattern.selected()",
        "attr.aria-disabled": "_pattern.disabled()"
      }
    },
    exportAs: ["ngOption"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: Option,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngOption]',
      exportAs: 'ngOption',
      host: {
        'role': 'option',
        '[attr.data-active]': 'active()',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-selected]': '_pattern.selected()',
        '[attr.aria-disabled]': '_pattern.disabled()'
      }
    }]
  }],
  propDecorators: {
    id: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    value: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "value",
        required: true
      }]
    }],
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    label: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "label",
        required: false
      }]
    }]
  }
});

class Listbox {
  id = input(inject(_IdGenerator).getId('ng-listbox-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _popup = inject(ComboboxPopup, {
    optional: true
  });
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _options = contentChildren(Option, {
    ...(ngDevMode ? {
      debugName: "_options"
    } : {}),
    descendants: true
  });
  textDirection = inject(Directionality).valueSignal.asReadonly();
  items = computed(() => this._options().map(option => option._pattern), ...(ngDevMode ? [{
    debugName: "items"
  }] : []));
  orientation = input('vertical', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  multi = input(false, {
    ...(ngDevMode ? {
      debugName: "multi"
    } : {}),
    transform: booleanAttribute
  });
  wrap = input(true, {
    ...(ngDevMode ? {
      debugName: "wrap"
    } : {}),
    transform: booleanAttribute
  });
  softDisabled = input(true, {
    ...(ngDevMode ? {
      debugName: "softDisabled"
    } : {}),
    transform: booleanAttribute
  });
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
  }] : []));
  selectionMode = input('follow', ...(ngDevMode ? [{
    debugName: "selectionMode"
  }] : []));
  typeaheadDelay = input(500, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  readonly = input(false, {
    ...(ngDevMode ? {
      debugName: "readonly"
    } : {}),
    transform: booleanAttribute
  });
  values = model([], ...(ngDevMode ? [{
    debugName: "values"
  }] : []));
  _pattern;
  _hasFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasFocused"
  }] : []));
  constructor() {
    const inputs = {
      ...this,
      id: this.id,
      items: this.items,
      activeItem: signal(undefined),
      textDirection: this.textDirection,
      element: () => this._elementRef.nativeElement,
      combobox: () => this._popup?.combobox?._pattern
    };
    this._pattern = this._popup?.combobox ? new ComboboxListboxPattern(inputs) : new ListboxPattern(inputs);
    if (this._popup) {
      this._popup._controls.set(this._pattern);
    }
    afterRenderEffect(() => {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        const violations = this._pattern.validate();
        for (const violation of violations) {
          console.error(violation);
        }
      }
    });
    afterRenderEffect(() => {
      if (!this._hasFocused()) {
        this._pattern.setDefaultState();
      }
    });
    afterRenderEffect(() => {
      const items = inputs.items();
      const activeItem = untracked(() => inputs.activeItem());
      if (!items.some(i => i === activeItem) && activeItem) {
        this._pattern.listBehavior.unfocus();
      }
    });
    afterRenderEffect(() => {
      const items = inputs.items();
      const values = untracked(() => this.values());
      if (items && values.some(v => !items.some(i => i.value() === v))) {
        this.values.set(values.filter(v => items.some(i => i.value() === v)));
      }
    });
  }
  _onFocus() {
    this._hasFocused.set(true);
  }
  scrollActiveItemIntoView(options = {
    block: 'nearest'
  }) {
    this._pattern.inputs.activeItem()?.element()?.scrollIntoView(options);
  }
  gotoFirst() {
    this._pattern.listBehavior.first();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Listbox,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: Listbox,
    isStandalone: true,
    selector: "[ngListbox]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      orientation: {
        classPropertyName: "orientation",
        publicName: "orientation",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      multi: {
        classPropertyName: "multi",
        publicName: "multi",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      wrap: {
        classPropertyName: "wrap",
        publicName: "wrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      softDisabled: {
        classPropertyName: "softDisabled",
        publicName: "softDisabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      focusMode: {
        classPropertyName: "focusMode",
        publicName: "focusMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectionMode: {
        classPropertyName: "selectionMode",
        publicName: "selectionMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      typeaheadDelay: {
        classPropertyName: "typeaheadDelay",
        publicName: "typeaheadDelay",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      readonly: {
        classPropertyName: "readonly",
        publicName: "readonly",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      values: {
        classPropertyName: "values",
        publicName: "values",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      values: "valuesChange"
    },
    host: {
      attributes: {
        "role": "listbox"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "_onFocus()"
      },
      properties: {
        "attr.id": "id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-readonly": "_pattern.readonly()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()",
        "attr.aria-multiselectable": "_pattern.multi()",
        "attr.aria-activedescendant": "_pattern.activeDescendant()"
      }
    },
    providers: [{
      provide: LISTBOX,
      useExisting: Listbox
    }],
    queries: [{
      propertyName: "_options",
      predicate: Option,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngListbox"],
    hostDirectives: [{
      directive: ComboboxPopup
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: Listbox,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngListbox]',
      exportAs: 'ngListbox',
      host: {
        'role': 'listbox',
        '[attr.id]': 'id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-readonly]': '_pattern.readonly()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '[attr.aria-multiselectable]': '_pattern.multi()',
        '[attr.aria-activedescendant]': '_pattern.activeDescendant()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': '_onFocus()'
      },
      hostDirectives: [ComboboxPopup],
      providers: [{
        provide: LISTBOX,
        useExisting: Listbox
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    id: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    _options: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => Option), {
        ...{
          descendants: true
        },
        isSignal: true
      }]
    }],
    orientation: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "orientation",
        required: false
      }]
    }],
    multi: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "multi",
        required: false
      }]
    }],
    wrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "wrap",
        required: false
      }]
    }],
    softDisabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "softDisabled",
        required: false
      }]
    }],
    focusMode: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "focusMode",
        required: false
      }]
    }],
    selectionMode: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "selectionMode",
        required: false
      }]
    }],
    typeaheadDelay: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "typeaheadDelay",
        required: false
      }]
    }],
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    readonly: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "readonly",
        required: false
      }]
    }],
    values: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "values",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["valuesChange"]
    }]
  }
});

export { Listbox, Option, ComboboxPopup as ɵɵComboboxPopup };
//# sourceMappingURL=listbox.mjs.map
