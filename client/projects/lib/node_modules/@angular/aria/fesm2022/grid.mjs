import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, contentChildren, computed, input, booleanAttribute, NgZone, afterRenderEffect, Directive, output, model } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { GridPattern, GridCellWidgetPattern, GridCellPattern, GridRowPattern } from './_widget-chunk.mjs';
import { _IdGenerator } from '@angular/cdk/a11y';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_pointer-event-manager-chunk.mjs';
import './_list-navigation-chunk.mjs';

const GRID_CELL = new InjectionToken('GRID_CELL');
const GRID_ROW = new InjectionToken('GRID_ROW');

class Grid {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _rows = contentChildren(GRID_ROW, {
    ...(ngDevMode ? {
      debugName: "_rows"
    } : {}),
    descendants: true
  });
  _rowPatterns = computed(() => this._rows().map(r => r._pattern), ...(ngDevMode ? [{
    debugName: "_rowPatterns"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  enableSelection = input(false, {
    ...(ngDevMode ? {
      debugName: "enableSelection"
    } : {}),
    transform: booleanAttribute
  });
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
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
  }] : []));
  rowWrap = input('loop', ...(ngDevMode ? [{
    debugName: "rowWrap"
  }] : []));
  colWrap = input('loop', ...(ngDevMode ? [{
    debugName: "colWrap"
  }] : []));
  multi = input(false, {
    ...(ngDevMode ? {
      debugName: "multi"
    } : {}),
    transform: booleanAttribute
  });
  selectionMode = input('follow', ...(ngDevMode ? [{
    debugName: "selectionMode"
  }] : []));
  enableRangeSelection = input(false, {
    ...(ngDevMode ? {
      debugName: "enableRangeSelection"
    } : {}),
    transform: booleanAttribute
  });
  _pattern = new GridPattern({
    ...this,
    rows: this._rowPatterns,
    getCell: e => this._getCell(e),
    element: () => this.element
  });
  constructor() {
    const ngZone = inject(NgZone);
    ngZone.runOutsideAngular(() => {
      this.element.addEventListener('pointermove', event => {
        if (this._pattern.acceptsPointerMove()) {
          ngZone.run(() => this._pattern.onPointermove(event));
        }
      }, {
        passive: true
      });
    });
    afterRenderEffect(() => this._pattern.setDefaultStateEffect());
    afterRenderEffect(() => this._pattern.resetStateEffect());
    afterRenderEffect(() => this._pattern.resetFocusEffect());
    afterRenderEffect(() => this._pattern.restoreFocusEffect());
    afterRenderEffect(() => this._pattern.focusEffect());
  }
  _getCell(element) {
    let target = element;
    while (target) {
      for (const row of this._rowPatterns()) {
        for (const cell of row.inputs.cells()) {
          if (cell.element() === target) {
            return cell;
          }
        }
      }
      target = target.parentElement?.closest('[ngGridCell]');
    }
    return undefined;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: Grid,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: Grid,
    isStandalone: true,
    selector: "[ngGrid]",
    inputs: {
      enableSelection: {
        classPropertyName: "enableSelection",
        publicName: "enableSelection",
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
      },
      focusMode: {
        classPropertyName: "focusMode",
        publicName: "focusMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      rowWrap: {
        classPropertyName: "rowWrap",
        publicName: "rowWrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      colWrap: {
        classPropertyName: "colWrap",
        publicName: "colWrap",
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
      selectionMode: {
        classPropertyName: "selectionMode",
        publicName: "selectionMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      enableRangeSelection: {
        classPropertyName: "enableRangeSelection",
        publicName: "enableRangeSelection",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "grid"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "pointerup": "_pattern.onPointerup($event)",
        "focusin": "_pattern.onFocusIn($event)",
        "focusout": "_pattern.onFocusOut($event)"
      },
      properties: {
        "tabindex": "_pattern.tabIndex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-activedescendant": "_pattern.activeDescendant()"
      }
    },
    queries: [{
      propertyName: "_rows",
      predicate: GRID_ROW,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngGrid"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: Grid,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGrid]',
      exportAs: 'ngGrid',
      host: {
        'role': 'grid',
        '[tabindex]': '_pattern.tabIndex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-activedescendant]': '_pattern.activeDescendant()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(pointerup)': '_pattern.onPointerup($event)',
        '(focusin)': '_pattern.onFocusIn($event)',
        '(focusout)': '_pattern.onFocusOut($event)'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _rows: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => GRID_ROW), {
        ...{
          descendants: true
        },
        isSignal: true
      }]
    }],
    enableSelection: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "enableSelection",
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
    }],
    focusMode: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "focusMode",
        required: false
      }]
    }],
    rowWrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "rowWrap",
        required: false
      }]
    }],
    colWrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "colWrap",
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
    selectionMode: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "selectionMode",
        required: false
      }]
    }],
    enableRangeSelection: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "enableRangeSelection",
        required: false
      }]
    }]
  }
});

class GridCellWidget {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  _cell = inject(GRID_CELL);
  id = input(inject(_IdGenerator).getId('ng-grid-cell-widget-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  widgetType = input('simple', ...(ngDevMode ? [{
    debugName: "widgetType"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  focusTarget = input(...(ngDevMode ? [undefined, {
    debugName: "focusTarget"
  }] : []));
  onActivate = output();
  onDeactivate = output();
  tabindex = input(...(ngDevMode ? [undefined, {
    debugName: "tabindex"
  }] : []));
  _tabIndex = computed(() => this.tabindex() ?? (this.focusTarget() ? -1 : this._pattern.tabIndex()), ...(ngDevMode ? [{
    debugName: "_tabIndex"
  }] : []));
  _pattern = new GridCellWidgetPattern({
    ...this,
    element: () => this.element,
    cell: () => this._cell._pattern,
    focusTarget: computed(() => {
      if (this.focusTarget() instanceof ElementRef) {
        return this.focusTarget().nativeElement;
      }
      return this.focusTarget();
    })
  });
  get isActivated() {
    return computed(() => this._pattern.isActivated());
  }
  constructor() {
    afterRenderEffect(() => {
      const activateEvent = this._pattern.lastActivateEvent();
      if (activateEvent) {
        this.onActivate.emit(activateEvent);
      }
    });
    afterRenderEffect(() => {
      const deactivateEvent = this._pattern.lastDeactivateEvent();
      if (deactivateEvent) {
        this.onDeactivate.emit(deactivateEvent);
      }
    });
  }
  activate() {
    this._pattern.activate();
  }
  deactivate() {
    this._pattern.deactivate();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: GridCellWidget,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.0.3",
    type: GridCellWidget,
    isStandalone: true,
    selector: "[ngGridCellWidget]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      widgetType: {
        classPropertyName: "widgetType",
        publicName: "widgetType",
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
      focusTarget: {
        classPropertyName: "focusTarget",
        publicName: "focusTarget",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      tabindex: {
        classPropertyName: "tabindex",
        publicName: "tabindex",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      onActivate: "onActivate",
      onDeactivate: "onDeactivate"
    },
    host: {
      properties: {
        "attr.data-active": "active()",
        "attr.data-active-control": "isActivated() ? \"widget\" : \"cell\"",
        "tabindex": "_tabIndex()"
      }
    },
    exportAs: ["ngGridCellWidget"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: GridCellWidget,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGridCellWidget]',
      exportAs: 'ngGridCellWidget',
      host: {
        '[attr.data-active]': 'active()',
        '[attr.data-active-control]': 'isActivated() ? "widget" : "cell"',
        '[tabindex]': '_tabIndex()'
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
    widgetType: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "widgetType",
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
    focusTarget: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "focusTarget",
        required: false
      }]
    }],
    onActivate: [{
      type: i0.Output,
      args: ["onActivate"]
    }],
    onDeactivate: [{
      type: i0.Output,
      args: ["onDeactivate"]
    }],
    tabindex: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "tabindex",
        required: false
      }]
    }]
  }
});

class GridCell {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  _widgets = contentChildren(GridCellWidget, {
    ...(ngDevMode ? {
      debugName: "_widgets"
    } : {}),
    descendants: true
  });
  _widgetPatterns = computed(() => this._widgets().map(w => w._pattern), ...(ngDevMode ? [{
    debugName: "_widgetPatterns"
  }] : []));
  _row = inject(GRID_ROW);
  textDirection = inject(Directionality).valueSignal;
  id = input(inject(_IdGenerator).getId('ng-grid-cell-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  role = input('gridcell', ...(ngDevMode ? [{
    debugName: "role"
  }] : []));
  rowSpan = input(1, ...(ngDevMode ? [{
    debugName: "rowSpan"
  }] : []));
  colSpan = input(1, ...(ngDevMode ? [{
    debugName: "colSpan"
  }] : []));
  rowIndex = input(...(ngDevMode ? [undefined, {
    debugName: "rowIndex"
  }] : []));
  colIndex = input(...(ngDevMode ? [undefined, {
    debugName: "colIndex"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  selected = model(false, ...(ngDevMode ? [{
    debugName: "selected"
  }] : []));
  selectable = input(true, ...(ngDevMode ? [{
    debugName: "selectable"
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
  tabindex = input(...(ngDevMode ? [undefined, {
    debugName: "tabindex"
  }] : []));
  _tabIndex = computed(() => this.tabindex() ?? this._pattern.tabIndex(), ...(ngDevMode ? [{
    debugName: "_tabIndex"
  }] : []));
  _pattern = new GridCellPattern({
    ...this,
    grid: this._row._gridPattern,
    row: () => this._row._pattern,
    widgets: this._widgetPatterns,
    getWidget: e => this._getWidget(e),
    element: () => this.element
  });
  constructor() {}
  _getWidget(element) {
    let target = element;
    while (target) {
      const pattern = this._widgetPatterns().find(w => w.element() === target);
      if (pattern) {
        return pattern;
      }
      target = target.parentElement?.closest('[ngGridCellWidget]');
    }
    return undefined;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: GridCell,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: GridCell,
    isStandalone: true,
    selector: "[ngGridCell]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      role: {
        classPropertyName: "role",
        publicName: "role",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      rowSpan: {
        classPropertyName: "rowSpan",
        publicName: "rowSpan",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      colSpan: {
        classPropertyName: "colSpan",
        publicName: "colSpan",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      rowIndex: {
        classPropertyName: "rowIndex",
        publicName: "rowIndex",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      colIndex: {
        classPropertyName: "colIndex",
        publicName: "colIndex",
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
      selected: {
        classPropertyName: "selected",
        publicName: "selected",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectable: {
        classPropertyName: "selectable",
        publicName: "selectable",
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
      wrap: {
        classPropertyName: "wrap",
        publicName: "wrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      tabindex: {
        classPropertyName: "tabindex",
        publicName: "tabindex",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      selected: "selectedChange"
    },
    host: {
      properties: {
        "attr.role": "role()",
        "attr.id": "_pattern.id()",
        "attr.rowspan": "_pattern.rowSpan()",
        "attr.colspan": "_pattern.colSpan()",
        "attr.data-active": "active()",
        "attr.data-anchor": "_pattern.anchor()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-rowspan": "_pattern.rowSpan()",
        "attr.aria-colspan": "_pattern.colSpan()",
        "attr.aria-rowindex": "_pattern.ariaRowIndex()",
        "attr.aria-colindex": "_pattern.ariaColIndex()",
        "attr.aria-selected": "_pattern.ariaSelected()",
        "tabindex": "_tabIndex()"
      }
    },
    providers: [{
      provide: GRID_CELL,
      useExisting: GridCell
    }],
    queries: [{
      propertyName: "_widgets",
      predicate: GridCellWidget,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngGridCell"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: GridCell,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGridCell]',
      exportAs: 'ngGridCell',
      host: {
        '[attr.role]': 'role()',
        '[attr.id]': '_pattern.id()',
        '[attr.rowspan]': '_pattern.rowSpan()',
        '[attr.colspan]': '_pattern.colSpan()',
        '[attr.data-active]': 'active()',
        '[attr.data-anchor]': '_pattern.anchor()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-rowspan]': '_pattern.rowSpan()',
        '[attr.aria-colspan]': '_pattern.colSpan()',
        '[attr.aria-rowindex]': '_pattern.ariaRowIndex()',
        '[attr.aria-colindex]': '_pattern.ariaColIndex()',
        '[attr.aria-selected]': '_pattern.ariaSelected()',
        '[tabindex]': '_tabIndex()'
      },
      providers: [{
        provide: GRID_CELL,
        useExisting: GridCell
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _widgets: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => GridCellWidget), {
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
    role: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "role",
        required: false
      }]
    }],
    rowSpan: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "rowSpan",
        required: false
      }]
    }],
    colSpan: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "colSpan",
        required: false
      }]
    }],
    rowIndex: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "rowIndex",
        required: false
      }]
    }],
    colIndex: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "colIndex",
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
    selected: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "selected",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["selectedChange"]
    }],
    selectable: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "selectable",
        required: false
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
    wrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "wrap",
        required: false
      }]
    }],
    tabindex: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "tabindex",
        required: false
      }]
    }]
  }
});

class GridRow {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _cells = contentChildren(GRID_CELL, {
    ...(ngDevMode ? {
      debugName: "_cells"
    } : {}),
    descendants: true
  });
  _cellPatterns = computed(() => this._cells().map(c => c._pattern), ...(ngDevMode ? [{
    debugName: "_cellPatterns"
  }] : []));
  _grid = inject(Grid);
  _gridPattern = computed(() => this._grid._pattern, ...(ngDevMode ? [{
    debugName: "_gridPattern"
  }] : []));
  rowIndex = input(...(ngDevMode ? [undefined, {
    debugName: "rowIndex"
  }] : []));
  _pattern = new GridRowPattern({
    ...this,
    cells: this._cellPatterns,
    grid: this._gridPattern
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: GridRow,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.0.3",
    type: GridRow,
    isStandalone: true,
    selector: "[ngGridRow]",
    inputs: {
      rowIndex: {
        classPropertyName: "rowIndex",
        publicName: "rowIndex",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "row"
      },
      properties: {
        "attr.aria-rowindex": "_pattern.rowIndex()"
      }
    },
    providers: [{
      provide: GRID_ROW,
      useExisting: GridRow
    }],
    queries: [{
      propertyName: "_cells",
      predicate: GRID_CELL,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngGridRow"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: GridRow,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGridRow]',
      exportAs: 'ngGridRow',
      host: {
        'role': 'row',
        '[attr.aria-rowindex]': '_pattern.rowIndex()'
      },
      providers: [{
        provide: GRID_ROW,
        useExisting: GridRow
      }]
    }]
  }],
  propDecorators: {
    _cells: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => GRID_CELL), {
        ...{
          descendants: true
        },
        isSignal: true
      }]
    }],
    rowIndex: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "rowIndex",
        required: false
      }]
    }]
  }
});

export { Grid, GridCell, GridCellWidget, GridRow };
//# sourceMappingURL=grid.mjs.map
