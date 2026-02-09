import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, signal, computed, input, booleanAttribute, model, afterRenderEffect, Directive } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { TabListPattern, TabPanelPattern, TabPattern } from './_tabs-chunk.mjs';
import { _IdGenerator } from '@angular/cdk/a11y';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.mjs';
import './_expansion-chunk.mjs';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_list-navigation-chunk.mjs';
import './_pointer-event-manager-chunk.mjs';

const TABS = new InjectionToken('TABS');
function sortDirectives(a, b) {
  return (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}

class TabList {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _tabs = inject(TABS);
  _unorderedTabs = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_unorderedTabs"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  _tabPatterns = computed(() => [...this._unorderedTabs()].sort(sortDirectives).map(tab => tab._pattern), ...(ngDevMode ? [{
    debugName: "_tabPatterns"
  }] : []));
  orientation = input('horizontal', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
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
  selectedTab = model(...(ngDevMode ? [undefined, {
    debugName: "selectedTab"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  _pattern = new TabListPattern({
    ...this,
    items: this._tabPatterns,
    activeItem: signal(undefined),
    element: () => this._elementRef.nativeElement
  });
  _hasFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasFocused"
  }] : []));
  constructor() {
    afterRenderEffect(() => {
      if (!this._hasFocused()) {
        this._pattern.setDefaultState();
      }
    });
    afterRenderEffect(() => {
      const tab = this._pattern.selectedTab();
      if (tab) {
        this.selectedTab.set(tab.value());
      }
    });
    afterRenderEffect(() => {
      const value = this.selectedTab();
      if (value) {
        this._tabPatterns().forEach(tab => tab.expanded.set(false));
        const tab = this._tabPatterns().find(t => t.value() === value);
        this._pattern.selectedTab.set(tab);
        tab?.expanded.set(true);
      }
    });
  }
  _onFocus() {
    this._hasFocused.set(true);
  }
  ngOnInit() {
    this._tabs._register(this);
  }
  ngOnDestroy() {
    this._tabs._unregister(this);
  }
  _register(child) {
    this._unorderedTabs().add(child);
    this._unorderedTabs.set(new Set(this._unorderedTabs()));
  }
  _unregister(child) {
    this._unorderedTabs().delete(child);
    this._unorderedTabs.set(new Set(this._unorderedTabs()));
  }
  open(value) {
    return this._pattern.open(value);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: TabList,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: TabList,
    isStandalone: true,
    selector: "[ngTabList]",
    inputs: {
      orientation: {
        classPropertyName: "orientation",
        publicName: "orientation",
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
      selectedTab: {
        classPropertyName: "selectedTab",
        publicName: "selectedTab",
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
      }
    },
    outputs: {
      selectedTab: "selectedTabChange"
    },
    host: {
      attributes: {
        "role": "tablist"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "_onFocus()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()",
        "attr.aria-activedescendant": "_pattern.activeDescendant()"
      }
    },
    exportAs: ["ngTabList"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: TabList,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabList]',
      exportAs: 'ngTabList',
      host: {
        'role': 'tablist',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '[attr.aria-activedescendant]': '_pattern.activeDescendant()',
        '(keydown)': '_pattern.onKeydown($event)',
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
    selectedTab: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "selectedTab",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["selectedTabChange"]
    }],
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }]
  }
});

class TabPanel {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _deferredContentAware = inject(DeferredContentAware);
  _tabs = inject(TABS);
  id = input(inject(_IdGenerator).getId('ng-tabpanel-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _tabPattern = computed(() => this._tabs._tabPatterns()?.find(tab => tab.value() === this.value()), ...(ngDevMode ? [{
    debugName: "_tabPattern"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  visible = computed(() => !this._pattern.hidden(), ...(ngDevMode ? [{
    debugName: "visible"
  }] : []));
  _pattern = new TabPanelPattern({
    ...this,
    tab: this._tabPattern
  });
  constructor() {
    afterRenderEffect(() => this._deferredContentAware.contentVisible.set(this.visible()));
  }
  ngOnInit() {
    this._tabs._register(this);
  }
  ngOnDestroy() {
    this._tabs._unregister(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: TabPanel,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: TabPanel,
    isStandalone: true,
    selector: "[ngTabPanel]",
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
      }
    },
    host: {
      attributes: {
        "role": "tabpanel"
      },
      properties: {
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.inert": "!visible() ? true : null",
        "attr.aria-labelledby": "_pattern.labelledBy()"
      }
    },
    exportAs: ["ngTabPanel"],
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
  type: TabPanel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabPanel]',
      exportAs: 'ngTabPanel',
      host: {
        'role': 'tabpanel',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.inert]': '!visible() ? true : null',
        '[attr.aria-labelledby]': '_pattern.labelledBy()'
      },
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
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

class Tabs {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _tablist = signal(undefined, ...(ngDevMode ? [{
    debugName: "_tablist"
  }] : []));
  _unorderedPanels = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_unorderedPanels"
  }] : []));
  _tabPatterns = computed(() => this._tablist()?._tabPatterns(), ...(ngDevMode ? [{
    debugName: "_tabPatterns"
  }] : []));
  _unorderedTabpanelPatterns = computed(() => [...this._unorderedPanels()].map(tabpanel => tabpanel._pattern), ...(ngDevMode ? [{
    debugName: "_unorderedTabpanelPatterns"
  }] : []));
  _register(child) {
    if (child instanceof TabList) {
      this._tablist.set(child);
    }
    if (child instanceof TabPanel) {
      this._unorderedPanels().add(child);
      this._unorderedPanels.set(new Set(this._unorderedPanels()));
    }
  }
  _unregister(child) {
    if (child instanceof TabList) {
      this._tablist.set(undefined);
    }
    if (child instanceof TabPanel) {
      this._unorderedPanels().delete(child);
      this._unorderedPanels.set(new Set(this._unorderedPanels()));
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Tabs,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: Tabs,
    isStandalone: true,
    selector: "[ngTabs]",
    providers: [{
      provide: TABS,
      useExisting: Tabs
    }],
    exportAs: ["ngTabs"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: Tabs,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabs]',
      exportAs: 'ngTabs',
      providers: [{
        provide: TABS,
        useExisting: Tabs
      }]
    }]
  }]
});

class Tab {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _tabs = inject(TABS);
  _tabList = inject(TabList);
  id = input(inject(_IdGenerator).getId('ng-tab-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _tablistPattern = computed(() => this._tabList._pattern, ...(ngDevMode ? [{
    debugName: "_tablistPattern"
  }] : []));
  _tabpanelPattern = computed(() => this._tabs._unorderedTabpanelPatterns().find(tabpanel => tabpanel.value() === this.value()), ...(ngDevMode ? [{
    debugName: "_tabpanelPattern"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  selected = computed(() => this._pattern.selected(), ...(ngDevMode ? [{
    debugName: "selected"
  }] : []));
  _pattern = new TabPattern({
    ...this,
    tablist: this._tablistPattern,
    tabpanel: this._tabpanelPattern,
    expanded: signal(false),
    element: () => this.element
  });
  open() {
    this._pattern.open();
  }
  ngOnInit() {
    this._tabList._register(this);
  }
  ngOnDestroy() {
    this._tabList._unregister(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Tab,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: Tab,
    isStandalone: true,
    selector: "[ngTab]",
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
      attributes: {
        "role": "tab"
      },
      properties: {
        "attr.data-active": "active()",
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-selected": "selected()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-controls": "_pattern.controls()"
      }
    },
    exportAs: ["ngTab"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: Tab,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTab]',
      exportAs: 'ngTab',
      host: {
        'role': 'tab',
        '[attr.data-active]': 'active()',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-selected]': 'selected()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-controls]': '_pattern.controls()'
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

class TabContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: TabContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: TabContent,
    isStandalone: true,
    selector: "ng-template[ngTabContent]",
    exportAs: ["ngTabContent"],
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
  type: TabContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngTabContent]',
      exportAs: 'ngTabContent',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { Tab, TabContent, TabList, TabPanel, Tabs, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
//# sourceMappingURL=tabs.mjs.map
