import * as i0 from '@angular/core';
import { InjectionToken, inject, signal, Directive, ElementRef, contentChild, input, booleanAttribute, computed, afterRenderEffect, model, untracked } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.mjs';
import { ComboboxPattern, ComboboxDialogPattern } from './_combobox-chunk.mjs';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_pointer-event-manager-chunk.mjs';

const COMBOBOX = new InjectionToken('COMBOBOX');

class ComboboxPopup {
  combobox = inject(COMBOBOX, {
    optional: true
  });
  _controls = signal(undefined, ...(ngDevMode ? [{
    debugName: "_controls"
  }] : []));
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: ComboboxPopup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: ComboboxPopup,
    isStandalone: true,
    selector: "[ngComboboxPopup]",
    exportAs: ["ngComboboxPopup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: ComboboxPopup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngComboboxPopup]',
      exportAs: 'ngComboboxPopup'
    }]
  }]
});

class Combobox {
  textDirection = inject(Directionality).valueSignal.asReadonly();
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _deferredContentAware = inject(DeferredContentAware, {
    optional: true
  });
  popup = contentChild(ComboboxPopup, ...(ngDevMode ? [{
    debugName: "popup"
  }] : []));
  filterMode = input('manual', ...(ngDevMode ? [{
    debugName: "filterMode"
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
  firstMatch = input(undefined, ...(ngDevMode ? [{
    debugName: "firstMatch"
  }] : []));
  expanded = computed(() => this.alwaysExpanded() || this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  alwaysExpanded = input(false, {
    ...(ngDevMode ? {
      debugName: "alwaysExpanded"
    } : {}),
    transform: booleanAttribute
  });
  inputElement = computed(() => this._pattern.inputs.inputEl(), ...(ngDevMode ? [{
    debugName: "inputElement"
  }] : []));
  _pattern = new ComboboxPattern({
    ...this,
    textDirection: this.textDirection,
    disabled: this.disabled,
    readonly: this.readonly,
    inputValue: signal(''),
    inputEl: signal(undefined),
    containerEl: () => this._elementRef.nativeElement,
    popupControls: () => this.popup()?._controls()
  });
  constructor() {
    afterRenderEffect(() => {
      if (this.alwaysExpanded()) {
        this._pattern.expanded.set(true);
      }
    });
    afterRenderEffect(() => {
      if (!this._deferredContentAware?.contentVisible() && (this._pattern.isFocused() || this.alwaysExpanded())) {
        this._deferredContentAware?.contentVisible.set(true);
      }
    });
  }
  open() {
    this._pattern.open({
      selected: true
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Combobox,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: Combobox,
    isStandalone: true,
    selector: "[ngCombobox]",
    inputs: {
      filterMode: {
        classPropertyName: "filterMode",
        publicName: "filterMode",
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
      firstMatch: {
        classPropertyName: "firstMatch",
        publicName: "firstMatch",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      alwaysExpanded: {
        classPropertyName: "alwaysExpanded",
        publicName: "alwaysExpanded",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      listeners: {
        "input": "_pattern.onInput($event)",
        "keydown": "_pattern.onKeydown($event)",
        "click": "_pattern.onClick($event)",
        "focusin": "_pattern.onFocusIn()",
        "focusout": "_pattern.onFocusOut($event)"
      },
      properties: {
        "attr.data-expanded": "expanded()"
      }
    },
    providers: [{
      provide: COMBOBOX,
      useExisting: Combobox
    }],
    queries: [{
      propertyName: "popup",
      first: true,
      predicate: ComboboxPopup,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngCombobox"],
    hostDirectives: [{
      directive: DeferredContentAware,
      inputs: ["preserveContent", "preserveContent"]
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: Combobox,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngCombobox]',
      exportAs: 'ngCombobox',
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }],
      host: {
        '[attr.data-expanded]': 'expanded()',
        '(input)': '_pattern.onInput($event)',
        '(keydown)': '_pattern.onKeydown($event)',
        '(click)': '_pattern.onClick($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(focusout)': '_pattern.onFocusOut($event)'
      },
      providers: [{
        provide: COMBOBOX,
        useExisting: Combobox
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    popup: [{
      type: i0.ContentChild,
      args: [i0.forwardRef(() => ComboboxPopup), {
        isSignal: true
      }]
    }],
    filterMode: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "filterMode",
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
    firstMatch: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "firstMatch",
        required: false
      }]
    }],
    alwaysExpanded: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "alwaysExpanded",
        required: false
      }]
    }]
  }
});

class ComboboxDialog {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  combobox = inject(Combobox);
  _popup = inject(ComboboxPopup, {
    optional: true
  });
  _pattern;
  constructor() {
    this._pattern = new ComboboxDialogPattern({
      id: () => '',
      element: () => this._elementRef.nativeElement,
      combobox: this.combobox._pattern
    });
    if (this._popup) {
      this._popup._controls.set(this._pattern);
    }
    afterRenderEffect(() => {
      if (this._elementRef) {
        this.combobox._pattern.expanded() ? this._elementRef.nativeElement.showModal() : this._elementRef.nativeElement.close();
      }
    });
  }
  close() {
    this._popup?.combobox?._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: ComboboxDialog,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: ComboboxDialog,
    isStandalone: true,
    selector: "dialog[ngComboboxDialog]",
    host: {
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "click": "_pattern.onClick($event)"
      },
      properties: {
        "attr.data-open": "combobox._pattern.expanded()"
      }
    },
    exportAs: ["ngComboboxDialog"],
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
  type: ComboboxDialog,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'dialog[ngComboboxDialog]',
      exportAs: 'ngComboboxDialog',
      host: {
        '[attr.data-open]': 'combobox._pattern.expanded()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(click)': '_pattern.onClick($event)'
      },
      hostDirectives: [ComboboxPopup]
    }]
  }],
  ctorParameters: () => []
});

class ComboboxInput {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  combobox = inject(Combobox);
  value = model('', ...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  constructor() {
    this.combobox._pattern.inputs.inputEl.set(this._elementRef.nativeElement);
    this.combobox._pattern.inputs.inputValue = this.value;
    const controls = this.combobox.popup()?._controls();
    if (controls instanceof ComboboxDialogPattern) {
      return;
    }
    afterRenderEffect(() => {
      this.value();
      controls?.items();
      untracked(() => this.combobox._pattern.onFilter());
    });
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: ComboboxInput,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: ComboboxInput,
    isStandalone: true,
    selector: "input[ngComboboxInput]",
    inputs: {
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      value: "valueChange"
    },
    host: {
      attributes: {
        "role": "combobox"
      },
      properties: {
        "value": "value()",
        "attr.aria-disabled": "combobox._pattern.disabled()",
        "attr.aria-expanded": "combobox._pattern.expanded()",
        "attr.aria-activedescendant": "combobox._pattern.activeDescendant()",
        "attr.aria-controls": "combobox._pattern.popupId()",
        "attr.aria-haspopup": "combobox._pattern.hasPopup()",
        "attr.aria-autocomplete": "combobox._pattern.autocomplete()",
        "attr.readonly": "combobox._pattern.readonly()"
      }
    },
    exportAs: ["ngComboboxInput"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: ComboboxInput,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[ngComboboxInput]',
      exportAs: 'ngComboboxInput',
      host: {
        'role': 'combobox',
        '[value]': 'value()',
        '[attr.aria-disabled]': 'combobox._pattern.disabled()',
        '[attr.aria-expanded]': 'combobox._pattern.expanded()',
        '[attr.aria-activedescendant]': 'combobox._pattern.activeDescendant()',
        '[attr.aria-controls]': 'combobox._pattern.popupId()',
        '[attr.aria-haspopup]': 'combobox._pattern.hasPopup()',
        '[attr.aria-autocomplete]': 'combobox._pattern.autocomplete()',
        '[attr.readonly]': 'combobox._pattern.readonly()'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    value: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "value",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["valueChange"]
    }]
  }
});

class ComboboxPopupContainer {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: ComboboxPopupContainer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: ComboboxPopupContainer,
    isStandalone: true,
    selector: "ng-template[ngComboboxPopupContainer]",
    exportAs: ["ngComboboxPopupContainer"],
    hostDirectives: [{
      directive: DeferredContent
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: ComboboxPopupContainer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngComboboxPopupContainer]',
      exportAs: 'ngComboboxPopupContainer',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { Combobox, ComboboxDialog, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
//# sourceMappingURL=combobox.mjs.map
