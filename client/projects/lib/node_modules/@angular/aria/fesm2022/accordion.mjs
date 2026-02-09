import * as i0 from '@angular/core';
import { inject, input, computed, signal, afterRenderEffect, Directive, InjectionToken, ElementRef, booleanAttribute, model, contentChildren } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.mjs';
import { AccordionPanelPattern, AccordionTriggerPattern, AccordionGroupPattern } from './_accordion-chunk.mjs';
import { Directionality } from '@angular/cdk/bidi';
import './_expansion-chunk.mjs';
import './_list-navigation-chunk.mjs';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_pointer-event-manager-chunk.mjs';

class AccordionPanel {
  _deferredContentAware = inject(DeferredContentAware);
  id = input(inject(_IdGenerator).getId('ng-accordion-panel-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  panelId = input.required(...(ngDevMode ? [{
    debugName: "panelId"
  }] : []));
  visible = computed(() => !this._pattern.hidden(), ...(ngDevMode ? [{
    debugName: "visible"
  }] : []));
  _accordionTriggerPattern = signal(undefined, ...(ngDevMode ? [{
    debugName: "_accordionTriggerPattern"
  }] : []));
  _pattern = new AccordionPanelPattern({
    id: this.id,
    panelId: this.panelId,
    accordionTrigger: () => this._accordionTriggerPattern()
  });
  constructor() {
    afterRenderEffect(() => {
      this._deferredContentAware.contentVisible.set(this.visible());
    });
  }
  expand() {
    this._accordionTriggerPattern()?.open();
  }
  collapse() {
    this._accordionTriggerPattern()?.close();
  }
  toggle() {
    this._accordionTriggerPattern()?.toggle();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: AccordionPanel,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: AccordionPanel,
    isStandalone: true,
    selector: "[ngAccordionPanel]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      panelId: {
        classPropertyName: "panelId",
        publicName: "panelId",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "region"
      },
      properties: {
        "attr.id": "_pattern.id()",
        "attr.aria-labelledby": "_pattern.accordionTrigger()?.id()",
        "attr.inert": "!visible() ? true : null"
      }
    },
    exportAs: ["ngAccordionPanel"],
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
  type: AccordionPanel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionPanel]',
      exportAs: 'ngAccordionPanel',
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }],
      host: {
        'role': 'region',
        '[attr.id]': '_pattern.id()',
        '[attr.aria-labelledby]': '_pattern.accordionTrigger()?.id()',
        '[attr.inert]': '!visible() ? true : null'
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
    panelId: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "panelId",
        required: true
      }]
    }]
  }
});

const ACCORDION_GROUP = new InjectionToken('ACCORDION_GROUP');

class AccordionTrigger {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _accordionGroup = inject(ACCORDION_GROUP);
  id = input(inject(_IdGenerator).getId('ng-accordion-trigger-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  panelId = input.required(...(ngDevMode ? [{
    debugName: "panelId"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  expanded = model(false, ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  _accordionPanelPattern = signal(undefined, ...(ngDevMode ? [{
    debugName: "_accordionPanelPattern"
  }] : []));
  _pattern = new AccordionTriggerPattern({
    ...this,
    accordionGroup: computed(() => this._accordionGroup._pattern),
    accordionPanel: this._accordionPanelPattern,
    element: () => this.element
  });
  expand() {
    this._pattern.open();
  }
  collapse() {
    this._pattern.close();
  }
  toggle() {
    this._pattern.toggle();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: AccordionTrigger,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: AccordionTrigger,
    isStandalone: true,
    selector: "[ngAccordionTrigger]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      panelId: {
        classPropertyName: "panelId",
        publicName: "panelId",
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
      expanded: {
        classPropertyName: "expanded",
        publicName: "expanded",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      expanded: "expandedChange"
    },
    host: {
      attributes: {
        "role": "button"
      },
      properties: {
        "attr.data-active": "active()",
        "id": "_pattern.id()",
        "attr.aria-expanded": "expanded()",
        "attr.aria-controls": "_pattern.controls()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.disabled": "_pattern.hardDisabled() ? true : null",
        "attr.tabindex": "_pattern.tabIndex()"
      }
    },
    exportAs: ["ngAccordionTrigger"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: AccordionTrigger,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionTrigger]',
      exportAs: 'ngAccordionTrigger',
      host: {
        '[attr.data-active]': 'active()',
        'role': 'button',
        '[id]': '_pattern.id()',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-controls]': '_pattern.controls()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.disabled]': '_pattern.hardDisabled() ? true : null',
        '[attr.tabindex]': '_pattern.tabIndex()'
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
    panelId: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "panelId",
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
    expanded: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "expanded",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["expandedChange"]
    }]
  }
});

class AccordionGroup {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _triggers = contentChildren(AccordionTrigger, {
    ...(ngDevMode ? {
      debugName: "_triggers"
    } : {}),
    descendants: true
  });
  _triggerPatterns = computed(() => this._triggers().map(t => t._pattern), ...(ngDevMode ? [{
    debugName: "_triggerPatterns"
  }] : []));
  _panels = contentChildren(AccordionPanel, {
    ...(ngDevMode ? {
      debugName: "_panels"
    } : {}),
    descendants: true
  });
  textDirection = inject(Directionality).valueSignal;
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  multiExpandable = input(true, {
    ...(ngDevMode ? {
      debugName: "multiExpandable"
    } : {}),
    transform: booleanAttribute
  });
  softDisabled = input(true, {
    ...(ngDevMode ? {
      debugName: "softDisabled"
    } : {}),
    transform: booleanAttribute
  });
  wrap = input(false, {
    ...(ngDevMode ? {
      debugName: "wrap"
    } : {}),
    transform: booleanAttribute
  });
  _pattern = new AccordionGroupPattern({
    ...this,
    activeItem: signal(undefined),
    items: this._triggerPatterns,
    orientation: () => 'vertical',
    getItem: e => this._getItem(e),
    element: () => this.element
  });
  constructor() {
    afterRenderEffect(() => {
      const triggers = this._triggers();
      const panels = this._panels();
      for (const trigger of triggers) {
        const panel = panels.find(p => p.panelId() === trigger.panelId());
        trigger._accordionPanelPattern.set(panel?._pattern);
        if (panel) {
          panel._accordionTriggerPattern.set(trigger._pattern);
        }
      }
    });
  }
  expandAll() {
    this._pattern.expansionBehavior.openAll();
  }
  collapseAll() {
    this._pattern.expansionBehavior.closeAll();
  }
  _getItem(element) {
    let target = element;
    while (target) {
      const pattern = this._triggerPatterns().find(t => t.element() === target);
      if (pattern) {
        return pattern;
      }
      target = target.parentElement?.closest('[ngAccordionTrigger]');
    }
    return undefined;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: AccordionGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: AccordionGroup,
    isStandalone: true,
    selector: "[ngAccordionGroup]",
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      multiExpandable: {
        classPropertyName: "multiExpandable",
        publicName: "multiExpandable",
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
      wrap: {
        classPropertyName: "wrap",
        publicName: "wrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "_pattern.onFocus($event)"
      }
    },
    providers: [{
      provide: ACCORDION_GROUP,
      useExisting: AccordionGroup
    }],
    queries: [{
      propertyName: "_triggers",
      predicate: AccordionTrigger,
      descendants: true,
      isSignal: true
    }, {
      propertyName: "_panels",
      predicate: AccordionPanel,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngAccordionGroup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: AccordionGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionGroup]',
      exportAs: 'ngAccordionGroup',
      host: {
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': '_pattern.onFocus($event)'
      },
      providers: [{
        provide: ACCORDION_GROUP,
        useExisting: AccordionGroup
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _triggers: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => AccordionTrigger), {
        ...{
          descendants: true
        },
        isSignal: true
      }]
    }],
    _panels: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => AccordionPanel), {
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
    multiExpandable: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "multiExpandable",
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
    wrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "wrap",
        required: false
      }]
    }]
  }
});

class AccordionContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: AccordionContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: AccordionContent,
    isStandalone: true,
    selector: "ng-template[ngAccordionContent]",
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
  type: AccordionContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngAccordionContent]',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
//# sourceMappingURL=accordion.mjs.map
