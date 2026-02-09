import * as i0 from '@angular/core';
import { inject, ElementRef, input, computed, booleanAttribute, effect, Directive, InjectionToken, model, contentChildren, signal, output, afterRenderEffect, untracked } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { MenuTriggerPattern, MenuItemPattern, MenuBarPattern, MenuPattern } from './_menu-chunk.mjs';
import { _IdGenerator } from '@angular/cdk/a11y';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.mjs';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_list-chunk.mjs';
import './_list-navigation-chunk.mjs';
import './_list-typeahead-chunk.mjs';

class MenuTrigger {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  textDirection = inject(Directionality).valueSignal;
  menu = input(undefined, ...(ngDevMode ? [{
    debugName: "menu"
  }] : []));
  expanded = computed(() => this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  hasPopup = computed(() => this._pattern.hasPopup(), ...(ngDevMode ? [{
    debugName: "hasPopup"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  softDisabled = input(true, {
    ...(ngDevMode ? {
      debugName: "softDisabled"
    } : {}),
    transform: booleanAttribute
  });
  _pattern = new MenuTriggerPattern({
    textDirection: this.textDirection,
    element: computed(() => this._elementRef.nativeElement),
    menu: computed(() => this.menu()?._pattern),
    disabled: () => this.disabled()
  });
  constructor() {
    effect(() => this.menu()?.parent.set(this));
  }
  open() {
    this._pattern.open({
      first: true
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MenuTrigger,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: MenuTrigger,
    isStandalone: true,
    selector: "[ngMenuTrigger]",
    inputs: {
      menu: {
        classPropertyName: "menu",
        publicName: "menu",
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
      softDisabled: {
        classPropertyName: "softDisabled",
        publicName: "softDisabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      listeners: {
        "click": "_pattern.onClick()",
        "keydown": "_pattern.onKeydown($event)",
        "focusout": "_pattern.onFocusOut($event)",
        "focusin": "_pattern.onFocusIn()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.disabled": "!softDisabled() && _pattern.disabled() ? true : null",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-haspopup": "hasPopup()",
        "attr.aria-expanded": "expanded()",
        "attr.aria-controls": "_pattern.menu()?.id()"
      }
    },
    exportAs: ["ngMenuTrigger"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MenuTrigger,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngMenuTrigger]',
      exportAs: 'ngMenuTrigger',
      host: {
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.disabled]': '!softDisabled() && _pattern.disabled() ? true : null',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-haspopup]': 'hasPopup()',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-controls]': '_pattern.menu()?.id()',
        '(click)': '_pattern.onClick()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(focusout)': '_pattern.onFocusOut($event)',
        '(focusin)': '_pattern.onFocusIn()'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    menu: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "menu",
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
    softDisabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "softDisabled",
        required: false
      }]
    }]
  }
});

const MENU_COMPONENT = new InjectionToken('MENU_COMPONENT');

class MenuItem {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  id = input(inject(_IdGenerator).getId('ng-menu-item-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled"
  }] : []));
  searchTerm = model('', ...(ngDevMode ? [{
    debugName: "searchTerm"
  }] : []));
  parent = inject(MENU_COMPONENT, {
    optional: true
  });
  submenu = input(undefined, ...(ngDevMode ? [{
    debugName: "submenu"
  }] : []));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  expanded = computed(() => this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  hasPopup = computed(() => this._pattern.hasPopup(), ...(ngDevMode ? [{
    debugName: "hasPopup"
  }] : []));
  _pattern = new MenuItemPattern({
    id: this.id,
    value: this.value,
    element: computed(() => this._elementRef.nativeElement),
    disabled: this.disabled,
    searchTerm: this.searchTerm,
    parent: computed(() => this.parent?._pattern),
    submenu: computed(() => this.submenu()?._pattern)
  });
  constructor() {
    effect(() => this.submenu()?.parent.set(this));
  }
  open() {
    this._pattern.open({
      first: true
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MenuItem,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: MenuItem,
    isStandalone: true,
    selector: "[ngMenuItem]",
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
      searchTerm: {
        classPropertyName: "searchTerm",
        publicName: "searchTerm",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      submenu: {
        classPropertyName: "submenu",
        publicName: "submenu",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      searchTerm: "searchTermChange"
    },
    host: {
      attributes: {
        "role": "menuitem"
      },
      listeners: {
        "focusin": "_pattern.onFocusIn()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.data-active": "active()",
        "attr.aria-label": "value()",
        "attr.aria-haspopup": "hasPopup()",
        "attr.aria-expanded": "expanded()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-controls": "_pattern.submenu()?.id()"
      }
    },
    exportAs: ["ngMenuItem"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MenuItem,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngMenuItem]',
      exportAs: 'ngMenuItem',
      host: {
        'role': 'menuitem',
        '(focusin)': '_pattern.onFocusIn()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.data-active]': 'active()',
        '[attr.aria-label]': 'value()',
        '[attr.aria-haspopup]': 'hasPopup()',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-controls]': '_pattern.submenu()?.id()'
      }
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
    searchTerm: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "searchTerm",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["searchTermChange"]
    }],
    submenu: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "submenu",
        required: false
      }]
    }]
  }
});

class MenuBar {
  _allItems = contentChildren(MenuItem, {
    ...(ngDevMode ? {
      debugName: "_allItems"
    } : {}),
    descendants: true
  });
  _items = () => this._allItems().filter(i => i.parent === this);
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  softDisabled = input(true, {
    ...(ngDevMode ? {
      debugName: "softDisabled"
    } : {}),
    transform: booleanAttribute
  });
  textDirection = inject(Directionality).valueSignal;
  values = model([], ...(ngDevMode ? [{
    debugName: "values"
  }] : []));
  wrap = input(true, {
    ...(ngDevMode ? {
      debugName: "wrap"
    } : {}),
    transform: booleanAttribute
  });
  typeaheadDelay = input(500, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  _pattern;
  _itemPatterns = signal([], ...(ngDevMode ? [{
    debugName: "_itemPatterns"
  }] : []));
  onSelect = output();
  constructor() {
    this._pattern = new MenuBarPattern({
      ...this,
      items: this._itemPatterns,
      multi: () => false,
      softDisabled: () => true,
      focusMode: () => 'roving',
      orientation: () => 'horizontal',
      selectionMode: () => 'explicit',
      onSelect: value => this.onSelect.emit(value),
      activeItem: signal(undefined),
      element: computed(() => this._elementRef.nativeElement)
    });
    afterRenderEffect(() => {
      this._itemPatterns.set(this._items().map(i => i._pattern));
    });
    afterRenderEffect(() => {
      if (!this._pattern.hasBeenFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MenuBar,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: MenuBar,
    isStandalone: true,
    selector: "[ngMenuBar]",
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
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
      values: {
        classPropertyName: "values",
        publicName: "values",
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
      typeaheadDelay: {
        classPropertyName: "typeaheadDelay",
        publicName: "typeaheadDelay",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      values: "valuesChange",
      onSelect: "onSelect"
    },
    host: {
      attributes: {
        "role": "menubar"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "mouseover": "_pattern.onMouseOver($event)",
        "click": "_pattern.onClick($event)",
        "focusin": "_pattern.onFocusIn()",
        "focusout": "_pattern.onFocusOut($event)"
      },
      properties: {
        "attr.disabled": "!softDisabled() && _pattern.disabled() ? true : null",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.tabindex": "_pattern.tabIndex()"
      }
    },
    providers: [{
      provide: MENU_COMPONENT,
      useExisting: MenuBar
    }],
    queries: [{
      propertyName: "_allItems",
      predicate: MenuItem,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngMenuBar"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MenuBar,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngMenuBar]',
      exportAs: 'ngMenuBar',
      host: {
        'role': 'menubar',
        '[attr.disabled]': '!softDisabled() && _pattern.disabled() ? true : null',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(mouseover)': '_pattern.onMouseOver($event)',
        '(click)': '_pattern.onClick($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(focusout)': '_pattern.onFocusOut($event)'
      },
      providers: [{
        provide: MENU_COMPONENT,
        useExisting: MenuBar
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _allItems: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => MenuItem), {
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
    softDisabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "softDisabled",
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
    }],
    wrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "wrap",
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
    onSelect: [{
      type: i0.Output,
      args: ["onSelect"]
    }]
  }
});

class Menu {
  _deferredContentAware = inject(DeferredContentAware, {
    optional: true
  });
  _allItems = contentChildren(MenuItem, {
    ...(ngDevMode ? {
      debugName: "_allItems"
    } : {}),
    descendants: true
  });
  _items = computed(() => this._allItems().filter(i => i.parent === this), ...(ngDevMode ? [{
    debugName: "_items"
  }] : []));
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  textDirection = inject(Directionality).valueSignal;
  id = input(inject(_IdGenerator).getId('ng-menu-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  wrap = input(true, {
    ...(ngDevMode ? {
      debugName: "wrap"
    } : {}),
    transform: booleanAttribute
  });
  typeaheadDelay = input(500, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  parent = signal(undefined, ...(ngDevMode ? [{
    debugName: "parent"
  }] : []));
  _pattern;
  _itemPatterns = () => this._items().map(i => i._pattern);
  visible = computed(() => this._pattern.visible(), ...(ngDevMode ? [{
    debugName: "visible"
  }] : []));
  tabIndex = computed(() => this._pattern.tabIndex(), ...(ngDevMode ? [{
    debugName: "tabIndex"
  }] : []));
  onSelect = output();
  expansionDelay = input(100, ...(ngDevMode ? [{
    debugName: "expansionDelay"
  }] : []));
  constructor() {
    this._pattern = new MenuPattern({
      ...this,
      parent: computed(() => this.parent()?._pattern),
      items: this._itemPatterns,
      multi: () => false,
      softDisabled: () => true,
      focusMode: () => 'roving',
      orientation: () => 'vertical',
      selectionMode: () => 'explicit',
      activeItem: signal(undefined),
      element: computed(() => this._elementRef.nativeElement),
      onSelect: value => this.onSelect.emit(value)
    });
    afterRenderEffect(() => {
      const parent = this.parent();
      if (parent instanceof MenuItem && parent.parent instanceof MenuBar) {
        this._deferredContentAware?.contentVisible.set(true);
      } else {
        this._deferredContentAware?.contentVisible.set(this._pattern.visible() || !!this.parent()?._pattern.hasBeenFocused());
      }
    });
    afterRenderEffect(() => {
      if (this._pattern.visible()) {
        const activeItem = untracked(() => this._pattern.inputs.activeItem());
        this._pattern.listBehavior.goto(activeItem);
      }
    });
    afterRenderEffect(() => {
      if (!this._pattern.hasBeenFocused() && !this._pattern.hasBeenHovered() && this._items().length) {
        untracked(() => this._pattern.setDefaultState());
      }
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Menu,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: Menu,
    isStandalone: true,
    selector: "[ngMenu]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
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
      expansionDelay: {
        classPropertyName: "expansionDelay",
        publicName: "expansionDelay",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      onSelect: "onSelect"
    },
    host: {
      attributes: {
        "role": "menu"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "mouseover": "_pattern.onMouseOver($event)",
        "mouseout": "_pattern.onMouseOut($event)",
        "focusout": "_pattern.onFocusOut($event)",
        "focusin": "_pattern.onFocusIn()",
        "click": "_pattern.onClick($event)"
      },
      properties: {
        "attr.id": "_pattern.id()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.tabindex": "tabIndex()",
        "attr.data-visible": "visible()"
      }
    },
    providers: [{
      provide: MENU_COMPONENT,
      useExisting: Menu
    }],
    queries: [{
      propertyName: "_allItems",
      predicate: MenuItem,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngMenu"],
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
  type: Menu,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngMenu]',
      exportAs: 'ngMenu',
      host: {
        'role': 'menu',
        '[attr.id]': '_pattern.id()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.tabindex]': 'tabIndex()',
        '[attr.data-visible]': 'visible()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(mouseover)': '_pattern.onMouseOver($event)',
        '(mouseout)': '_pattern.onMouseOut($event)',
        '(focusout)': '_pattern.onFocusOut($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(click)': '_pattern.onClick($event)'
      },
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }],
      providers: [{
        provide: MENU_COMPONENT,
        useExisting: Menu
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _allItems: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => MenuItem), {
        ...{
          descendants: true
        },
        isSignal: true
      }]
    }],
    id: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "id",
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
    onSelect: [{
      type: i0.Output,
      args: ["onSelect"]
    }],
    expansionDelay: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "expansionDelay",
        required: false
      }]
    }]
  }
});

class MenuContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MenuContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MenuContent,
    isStandalone: true,
    selector: "ng-template[ngMenuContent]",
    exportAs: ["ngMenuContent"],
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
  type: MenuContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngMenuContent]',
      exportAs: 'ngMenuContent',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { Menu, MenuBar, MenuContent, MenuItem, MenuTrigger, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
//# sourceMappingURL=menu.mjs.map
