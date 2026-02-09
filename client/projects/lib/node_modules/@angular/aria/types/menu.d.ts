import * as _angular_core from '@angular/core';
import { Signal } from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import { MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern } from './_menu-chunk.js';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.js';
import { SignalLike } from './_list-navigation-chunk.js';
import './_keyboard-event-manager-chunk.js';
import './_list-chunk.js';

/**
 * A menu bar of menu items.
 *
 * Like the `ngMenu`, a `ngMenuBar` is used to offer a list of menu item choices to users.
 * However, a menubar is used to display a persistent, top-level, always-visible set of
 * menu item choices, typically found at the top of an application window.
 *
 * ```html
 * <div ngMenuBar>
 *   <button ngMenuTrigger [menu]="fileMenu">File</button>
 *   <button ngMenuTrigger [menu]="editMenu">Edit</button>
 * </div>
 *
 * <div ngMenu #fileMenu="ngMenu">
 *   <div ngMenuItem>New</div>
 *   <div ngMenuItem>Open</div>
 * </div>
 *
 * <div ngMenu #editMenu="ngMenu">
 *   <div ngMenuItem>Cut</div>
 *   <div ngMenuItem>Copy</div>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Menu](guide/aria/menu)
 * @see [MenuBar](guide/aria/menubar)
 */
declare class MenuBar<V> {
    /** The menu items contained in the menubar. */
    readonly _allItems: _angular_core.Signal<readonly MenuItem<V>[]>;
    readonly _items: SignalLike<MenuItem<V>[]>;
    /** A reference to the host element. */
    private readonly _elementRef;
    /** A reference to the host element. */
    readonly element: HTMLElement;
    /** Whether the menubar is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the menubar is soft disabled. */
    readonly softDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** The values of the currently selected menu items. */
    readonly values: _angular_core.ModelSignal<V[]>;
    /** Whether the menu should wrap its items. */
    readonly wrap: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The delay in milliseconds before the typeahead buffer is cleared. */
    readonly typeaheadDelay: _angular_core.InputSignal<number>;
    /** The menu ui pattern instance. */
    readonly _pattern: MenuBarPattern<V>;
    /** The menu items as a writable signal. */
    private readonly _itemPatterns;
    /** A callback function triggered when a menu item is selected. */
    onSelect: _angular_core.OutputEmitterRef<V>;
    constructor();
    /** Closes the menubar. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuBar<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuBar<any>, "[ngMenuBar]", ["ngMenuBar"], { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "softDisabled": { "alias": "softDisabled"; "required": false; "isSignal": true; }; "values": { "alias": "values"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; }, { "values": "valuesChange"; "onSelect": "onSelect"; }, ["_allItems"], never, true, never>;
}

/**
 * An item in a Menu.
 *
 * `ngMenuItem` directives can be used in `ngMenu` and `ngMenuBar` to represent a choice
 * or action a user can take. They can also act as triggers for sub-menus.
 *
 * ```html
 * <div ngMenuItem (onSelect)="doAction()">Action Item</div>
 *
 * <div ngMenuItem [submenu]="anotherMenu">Submenu Trigger</div>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Menu](guide/aria/menu)
 * @see [MenuBar](guide/aria/menubar)
 */
declare class MenuItem<V> {
    /** A reference to the host element. */
    private readonly _elementRef;
    /** A reference to the host element. */
    readonly element: HTMLElement;
    /** The unique ID of the menu item. */
    readonly id: _angular_core.InputSignal<string>;
    /** The value of the menu item, used as the default aria-label */
    readonly value: _angular_core.InputSignal<V>;
    /** Whether the menu item is disabled. */
    readonly disabled: _angular_core.InputSignal<boolean>;
    /** The search term associated with the menu item. */
    readonly searchTerm: _angular_core.ModelSignal<string>;
    /** A reference to the parent menu or menubar. */
    readonly parent: Menu<V> | MenuBar<V> | null;
    /** The submenu associated with the menu item. */
    readonly submenu: _angular_core.InputSignal<Menu<V> | undefined>;
    /** Whether the menu item is active. */
    readonly active: _angular_core.Signal<boolean>;
    /** Whether the menu is expanded. */
    readonly expanded: _angular_core.Signal<boolean | null>;
    /** Whether the menu item has a popup. */
    readonly hasPopup: _angular_core.Signal<boolean>;
    /** The menu item ui pattern instance. */
    readonly _pattern: MenuItemPattern<V>;
    constructor();
    /** Opens the submenu focusing on the first menu item. */
    open(): void;
    /** Closes the submenu. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuItem<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuItem<any>, "[ngMenuItem]", ["ngMenuItem"], { "id": { "alias": "id"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "searchTerm": { "alias": "searchTerm"; "required": false; "isSignal": true; }; "submenu": { "alias": "submenu"; "required": false; "isSignal": true; }; }, { "searchTerm": "searchTermChange"; }, never, never, true, never>;
}

/**
 * A list of menu items.
 *
 * A `ngMenu` is used to offer a list of menu item choices to users. Menus can be nested
 * within other menus to create sub-menus. It works in conjunction with `ngMenuTrigger`
 * and `ngMenuItem` directives.
 *
 * ```html
 * <button ngMenuTrigger [menu]="myMenu">Options</button>
 *
 * <div ngMenu #myMenu="ngMenu">
 *   <div ngMenuItem value="Star">Star</div>
 *   <div ngMenuItem value="Edit">Edit</div>
 *   <div ngMenuItem value="More" [submenu]="subMenu">More</div>
 * </div>
 *
 * <div ngMenu #subMenu="ngMenu">
 *   <div ngMenuItem value="Sub Item 1">Sub Item 1</div>
 *   <div ngMenuItem value="Sub Item 2">Sub Item 2</div>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Menu](guide/aria/menu)
 * @see [MenuBar](guide/aria/menubar)
 */
declare class Menu<V> {
    /** The DeferredContentAware host directive. */
    private readonly _deferredContentAware;
    /** The menu items contained in the menu. */
    readonly _allItems: Signal<readonly MenuItem<V>[]>;
    /** The menu items that are direct children of this menu. */
    readonly _items: Signal<MenuItem<V>[]>;
    /** A reference to the host element. */
    private readonly _elementRef;
    /** A reference to the host element. */
    readonly element: HTMLElement;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** The unique ID of the menu. */
    readonly id: _angular_core.InputSignal<string>;
    /** Whether the menu should wrap its items. */
    readonly wrap: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The delay in milliseconds before the typeahead buffer is cleared. */
    readonly typeaheadDelay: _angular_core.InputSignal<number>;
    /** Whether the menu is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** A reference to the parent menu item or menu trigger. */
    readonly parent: _angular_core.WritableSignal<MenuTrigger<V> | MenuItem<V> | undefined>;
    /** The menu ui pattern instance. */
    readonly _pattern: MenuPattern<V>;
    /**
     * The menu items as a writable signal.
     *
     * TODO(wagnermaciel): This would normally be a computed, but using a computed causes a bug where
     * sometimes the items array is empty. The bug can be reproduced by switching this to use a
     * computed and then quickly opening and closing menus in the dev app.
     */
    private readonly _itemPatterns;
    /** Whether the menu is visible. */
    readonly visible: Signal<boolean>;
    /** The tab index of the menu. */
    readonly tabIndex: Signal<0 | -1>;
    /** A callback function triggered when a menu item is selected. */
    onSelect: _angular_core.OutputEmitterRef<V>;
    /** The delay in milliseconds before expanding sub-menus on hover. */
    readonly expansionDelay: _angular_core.InputSignal<number>;
    constructor();
    /** Closes the menu. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Menu<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Menu<any>, "[ngMenu]", ["ngMenu"], { "id": { "alias": "id"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "expansionDelay": { "alias": "expansionDelay"; "required": false; "isSignal": true; }; }, { "onSelect": "onSelect"; }, ["_allItems"], never, true, [{ directive: typeof DeferredContentAware; inputs: { "preserveContent": "preserveContent"; }; outputs: {}; }]>;
}

/**
 * A trigger for a menu.
 *
 * The `ngMenuTrigger` directive is used to open and close menus. It can be applied to
 * any interactive element (e.g., a button) to associate it with a `ngMenu` instance.
 * It also supports linking to sub-menus when applied to a `ngMenuItem`.
 *
 * ```html
 * <button ngMenuTrigger [menu]="myMenu">Open Menu</button>
 *
 * <div ngMenu #myMenu="ngMenu">
 *   <div ngMenuItem>Item 1</div>
 *   <div ngMenuItem>Item 2</div>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Menu](guide/aria/menu)
 * @see [MenuBar](guide/aria/menubar)
 */
declare class MenuTrigger<V> {
    /** A reference to the host element. */
    private readonly _elementRef;
    /** A reference to the host element. */
    readonly element: HTMLElement;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** The menu associated with the trigger. */
    menu: _angular_core.InputSignal<Menu<V> | undefined>;
    /** Whether the menu is expanded. */
    readonly expanded: _angular_core.Signal<boolean>;
    /** Whether the menu trigger has a popup. */
    readonly hasPopup: _angular_core.Signal<boolean>;
    /** Whether the menu trigger is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the menu trigger is soft disabled. */
    readonly softDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The menu trigger ui pattern instance. */
    _pattern: MenuTriggerPattern<V>;
    constructor();
    /** Opens the menu focusing on the first menu item. */
    open(): void;
    /** Closes the menu. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuTrigger<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuTrigger<any>, "[ngMenuTrigger]", ["ngMenuTrigger"], { "menu": { "alias": "menu"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "softDisabled": { "alias": "softDisabled"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * Defers the rendering of the menu content.
 *
 * This structural directive should be applied to an `ng-template` within a `ngMenu`
 * or `ngMenuBar` to lazily render its content only when the menu is opened.
 *
 * ```html
 * <div ngMenu #myMenu="ngMenu">
 *   <ng-template ngMenuContent>
 *     <div ngMenuItem>Lazy Item 1</div>
 *     <div ngMenuItem>Lazy Item 2</div>
 *   </ng-template>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 *
 * @see [Menu](guide/aria/menu)
 * @see [MenuBar](guide/aria/menubar)
 */
declare class MenuContent {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuContent, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuContent, "ng-template[ngMenuContent]", ["ngMenuContent"], {}, {}, never, never, true, [{ directive: typeof DeferredContent; inputs: {}; outputs: {}; }]>;
}

export { Menu, MenuBar, MenuContent, MenuItem, MenuTrigger, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
