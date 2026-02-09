import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, signal, computed, input, booleanAttribute, model, afterRenderEffect, Directive, contentChildren } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { ToolbarPattern, ToolbarWidgetPattern, ToolbarWidgetGroupPattern } from './_toolbar-widget-group-chunk.mjs';
import { _IdGenerator } from '@angular/cdk/a11y';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_list-chunk.mjs';
import './_list-navigation-chunk.mjs';
import './_list-typeahead-chunk.mjs';

const TOOLBAR_WIDGET_GROUP = new InjectionToken('TOOLBAR_WIDGET_GROUP');
function sortDirectives(a, b) {
  return (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}

class Toolbar {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _widgets = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_widgets"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  _itemPatterns = computed(() => [...this._widgets()].sort(sortDirectives).map(widget => widget._pattern), ...(ngDevMode ? [{
    debugName: "_itemPatterns"
  }] : []));
  orientation = input('horizontal', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  softDisabled = input(true, {
    ...(ngDevMode ? {
      debugName: "softDisabled"
    } : {}),
    transform: booleanAttribute
  });
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  wrap = input(true, {
    ...(ngDevMode ? {
      debugName: "wrap"
    } : {}),
    transform: booleanAttribute
  });
  values = model([], ...(ngDevMode ? [{
    debugName: "values"
  }] : []));
  _pattern = new ToolbarPattern({
    ...this,
    items: this._itemPatterns,
    activeItem: signal(undefined),
    textDirection: this.textDirection,
    element: () => this._elementRef.nativeElement,
    getItem: e => this._getItem(e),
    values: this.values
  });
  _hasBeenFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasBeenFocused"
  }] : []));
  constructor() {
    afterRenderEffect(() => {
      if (!this._hasBeenFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  _onFocus() {
    this._hasBeenFocused.set(true);
  }
  _register(widget) {
    const widgets = this._widgets();
    if (!widgets.has(widget)) {
      widgets.add(widget);
      this._widgets.set(new Set(widgets));
    }
  }
  _unregister(widget) {
    const widgets = this._widgets();
    if (widgets.delete(widget)) {
      this._widgets.set(new Set(widgets));
    }
  }
  _getItem(element) {
    return this._itemPatterns().find(item => item.element()?.contains(element));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Toolbar,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: Toolbar,
    isStandalone: true,
    selector: "[ngToolbar]",
    inputs: {
      orientation: {
        classPropertyName: "orientation",
        publicName: "orientation",
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
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
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
        "role": "toolbar"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "click": "_pattern.onClick($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "_onFocus()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()"
      }
    },
    exportAs: ["ngToolbar"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: Toolbar,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngToolbar]',
      exportAs: 'ngToolbar',
      host: {
        'role': 'toolbar',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(click)': '_pattern.onClick($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': '_onFocus()'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    orientation: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "orientation",
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
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
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

class ToolbarWidget {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _toolbar = inject(Toolbar);
  id = input(inject(_IdGenerator).getId('ng-toolbar-widget-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _toolbarPattern = computed(() => this._toolbar._pattern, ...(ngDevMode ? [{
    debugName: "_toolbarPattern"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  hardDisabled = computed(() => this._pattern.disabled() && !this._toolbar.softDisabled(), ...(ngDevMode ? [{
    debugName: "hardDisabled"
  }] : []));
  _group = inject(TOOLBAR_WIDGET_GROUP, {
    optional: true
  });
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  selected = () => this._pattern.selected();
  _groupPattern = () => this._group?._pattern;
  _pattern = new ToolbarWidgetPattern({
    ...this,
    group: this._groupPattern,
    toolbar: this._toolbarPattern,
    id: this.id,
    value: this.value,
    element: () => this.element
  });
  ngOnInit() {
    this._toolbar._register(this);
  }
  ngOnDestroy() {
    this._toolbar._unregister(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: ToolbarWidget,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: ToolbarWidget,
    isStandalone: true,
    selector: "[ngToolbarWidget]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
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
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    host: {
      properties: {
        "attr.data-active": "active()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.inert": "hardDisabled() ? true : null",
        "attr.disabled": "hardDisabled() ? true : null",
        "attr.aria-disabled": "_pattern.disabled()",
        "id": "_pattern.id()"
      }
    },
    exportAs: ["ngToolbarWidget"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: ToolbarWidget,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngToolbarWidget]',
      exportAs: 'ngToolbarWidget',
      host: {
        '[attr.data-active]': 'active()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.inert]': 'hardDisabled() ? true : null',
        '[attr.disabled]': 'hardDisabled() ? true : null',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[id]': '_pattern.id()'
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
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
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
    }]
  }
});

class ToolbarWidgetGroup {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _toolbar = inject(Toolbar, {
    optional: true
  });
  _widgets = contentChildren(ToolbarWidget, {
    ...(ngDevMode ? {
      debugName: "_widgets"
    } : {}),
    descendants: true
  });
  _toolbarPattern = computed(() => this._toolbar?._pattern, ...(ngDevMode ? [{
    debugName: "_toolbarPattern"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  _itemPatterns = () => this._widgets().map(w => w._pattern);
  multi = input(false, {
    ...(ngDevMode ? {
      debugName: "multi"
    } : {}),
    transform: booleanAttribute
  });
  _pattern = new ToolbarWidgetGroupPattern({
    ...this,
    items: this._itemPatterns,
    toolbar: this._toolbarPattern
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: ToolbarWidgetGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: ToolbarWidgetGroup,
    isStandalone: true,
    selector: "[ngToolbarWidgetGroup]",
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
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
      }
    },
    providers: [{
      provide: TOOLBAR_WIDGET_GROUP,
      useExisting: ToolbarWidgetGroup
    }],
    queries: [{
      propertyName: "_widgets",
      predicate: ToolbarWidget,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngToolbarWidgetGroup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: ToolbarWidgetGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngToolbarWidgetGroup]',
      exportAs: 'ngToolbarWidgetGroup',
      providers: [{
        provide: TOOLBAR_WIDGET_GROUP,
        useExisting: ToolbarWidgetGroup
      }]
    }]
  }],
  propDecorators: {
    _widgets: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => ToolbarWidget), {
        ...{
          descendants: true
        },
        isSignal: true
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
    multi: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "multi",
        required: false
      }]
    }]
  }
});

export { Toolbar, ToolbarWidget, ToolbarWidgetGroup };
//# sourceMappingURL=toolbar.mjs.map
