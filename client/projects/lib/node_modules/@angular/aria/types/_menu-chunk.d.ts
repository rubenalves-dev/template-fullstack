import { SignalLike, WritableSignalLike } from './_list-navigation-chunk.js';
import { KeyboardEventManager } from './_keyboard-event-manager-chunk.js';
import { ListInputs, ListItem, List } from './_list-chunk.js';

/** The inputs for the MenuBarPattern class. */
interface MenuBarInputs<V> extends ListInputs<MenuItemPattern<V>, V> {
    /** The menu items contained in the menu. */
    items: SignalLike<MenuItemPattern<V>[]>;
    /** Callback function triggered when a menu item is selected. */
    onSelect?: (value: V) => void;
    /** The text direction of the menu bar. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
}
/** The inputs for the MenuPattern class. */
interface MenuInputs<V> extends Omit<ListInputs<MenuItemPattern<V>, V>, 'values'> {
    /** The unique ID of the menu. */
    id: SignalLike<string>;
    /** The menu items contained in the menu. */
    items: SignalLike<MenuItemPattern<V>[]>;
    /** A reference to the parent menu or menu trigger. */
    parent: SignalLike<MenuTriggerPattern<V> | MenuItemPattern<V> | undefined>;
    /** Callback function triggered when a menu item is selected. */
    onSelect?: (value: V) => void;
    /** The text direction of the menu bar. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
    /** The delay in milliseconds before expanding sub-menus on hover. */
    expansionDelay: SignalLike<number>;
}
/** The inputs for the MenuTriggerPattern class. */
interface MenuTriggerInputs<V> {
    /** A reference to the menu trigger element. */
    element: SignalLike<HTMLElement | undefined>;
    /** A reference to the menu associated with the trigger. */
    menu: SignalLike<MenuPattern<V> | undefined>;
    /** The text direction of the menu bar. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
    /** Whether the menu trigger is disabled. */
    disabled: SignalLike<boolean>;
}
/** The inputs for the MenuItemPattern class. */
interface MenuItemInputs<V> extends Omit<ListItem<V>, 'index' | 'selectable'> {
    /** A reference to the parent menu or menu trigger. */
    parent: SignalLike<MenuPattern<V> | MenuBarPattern<V> | undefined>;
    /** A reference to the submenu associated with the menu item. */
    submenu: SignalLike<MenuPattern<V> | undefined>;
}
/** The menu ui pattern class. */
declare class MenuPattern<V> {
    readonly inputs: MenuInputs<V>;
    /** The unique ID of the menu. */
    id: SignalLike<string>;
    /** The role of the menu. */
    role: () => string;
    /** Whether the menu is disabled. */
    disabled: () => boolean;
    /** Whether the menu is visible. */
    visible: SignalLike<boolean>;
    /** Controls list behavior for the menu items. */
    listBehavior: List<MenuItemPattern<V>, V>;
    /** Whether the menu or any of its child elements are currently focused. */
    isFocused: WritableSignalLike<boolean>;
    /** Whether the menu has received focus. */
    hasBeenFocused: WritableSignalLike<boolean>;
    /** Whether the menu trigger has been hovered. */
    hasBeenHovered: WritableSignalLike<boolean>;
    /** Timeout used to open sub-menus on hover. */
    _openTimeout: any;
    /** Timeout used to close sub-menus on hover out. */
    _closeTimeout: any;
    /** The tab index of the menu. */
    tabIndex: () => 0 | -1;
    /** Whether the menu should be focused on mouse over. */
    shouldFocus: SignalLike<boolean>;
    /** The key used to expand sub-menus. */
    private _expandKey;
    /** The key used to collapse sub-menus. */
    private _collapseKey;
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey: SignalLike<"" | " ">;
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp: RegExp;
    /** The root of the menu. */
    root: SignalLike<MenuTriggerPattern<V> | MenuBarPattern<V> | MenuPattern<V> | undefined>;
    /** Handles keyboard events for the menu. */
    keydownManager: SignalLike<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: MenuInputs<V>);
    /** Sets the default state for the menu. */
    setDefaultState(): void;
    /** Handles keyboard events for the menu. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles mouseover events for the menu. */
    onMouseOver(event: MouseEvent): void;
    /** Closes the specified menu item after a delay. */
    private _closeItem;
    /** Opens the specified menu item after a delay. */
    private _openItem;
    /** Handles mouseout events for the menu. */
    onMouseOut(event: MouseEvent): void;
    /** Handles click events for the menu. */
    onClick(event: MouseEvent): void;
    /** Handles focusin events for the menu. */
    onFocusIn(): void;
    /** Handles the focusout event for the menu. */
    onFocusOut(event: FocusEvent): void;
    /** Focuses the previous menu item. */
    prev(): void;
    /** Focuses the next menu item. */
    next(): void;
    /** Focuses the first menu item. */
    first(): void;
    /** Focuses the last menu item. */
    last(): void;
    /** Triggers the active menu item. */
    trigger(): void;
    /** Submits the menu. */
    submit(item?: MenuItemPattern<V> | undefined): void;
    /** Collapses the current menu or focuses the previous item in the menubar. */
    collapse(): void;
    /** Expands the current menu or focuses the next item in the menubar. */
    expand(): void;
    /** Closes the menu. */
    close(): void;
    /** Closes the menu and all parent menus. */
    closeAll(): void;
    /** Clears any open or close timeouts for sub-menus. */
    _clearTimeouts(): void;
    /** Clears the open timeout. */
    _clearOpenTimeout(): void;
    /** Clears the close timeout. */
    _clearCloseTimeout(): void;
}
/** The menubar ui pattern class. */
declare class MenuBarPattern<V> {
    readonly inputs: MenuBarInputs<V>;
    /** Controls list behavior for the menu items. */
    listBehavior: List<MenuItemPattern<V>, V>;
    /** The tab index of the menu. */
    tabIndex: () => 0 | -1;
    /** The key used to navigate to the next item. */
    private _nextKey;
    /** The key used to navigate to the previous item. */
    private _previousKey;
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey: SignalLike<"" | " ">;
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp: RegExp;
    /** Whether the menubar or any of its children are currently focused. */
    isFocused: WritableSignalLike<boolean>;
    /** Whether the menubar has been focused. */
    hasBeenFocused: WritableSignalLike<boolean>;
    /** Whether the menubar is disabled. */
    disabled: () => boolean;
    /** Handles keyboard events for the menu. */
    keydownManager: SignalLike<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: MenuBarInputs<V>);
    /** Sets the default state for the menubar. */
    setDefaultState(): void;
    /** Handles keyboard events for the menu. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles click events for the menu bar. */
    onClick(event: MouseEvent): void;
    /** Handles mouseover events for the menu bar. */
    onMouseOver(event: MouseEvent): void;
    /** Handles focusin events for the menu bar. */
    onFocusIn(): void;
    /** Handles focusout events for the menu bar. */
    onFocusOut(event: FocusEvent): void;
    /** Goes to and optionally focuses the specified menu item. */
    goto(item: MenuItemPattern<V>, opts?: {
        focusElement?: boolean;
    }): void;
    /** Focuses the next menu item. */
    next(): void;
    /** Focuses the previous menu item. */
    prev(): void;
    /** Closes the menubar and refocuses the root menu bar item. */
    close(): void;
}
/** The menu trigger ui pattern class. */
declare class MenuTriggerPattern<V> {
    readonly inputs: MenuTriggerInputs<V>;
    /** Whether the menu is expanded. */
    expanded: WritableSignalLike<boolean>;
    /** Whether the menu trigger has received focus. */
    hasBeenFocused: WritableSignalLike<boolean>;
    /** The role of the menu trigger. */
    role: () => string;
    /** Whether the menu trigger has a popup. */
    hasPopup: () => boolean;
    /** The menu associated with the trigger. */
    menu: SignalLike<MenuPattern<V> | undefined>;
    /** The tab index of the menu trigger. */
    tabIndex: SignalLike<-1 | 0>;
    /** Whether the menu trigger is disabled. */
    disabled: () => boolean;
    /** Handles keyboard events for the menu trigger. */
    keydownManager: SignalLike<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: MenuTriggerInputs<V>);
    /** Handles keyboard events for the menu trigger. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles click events for the menu trigger. */
    onClick(): void;
    /** Handles focusin events for the menu trigger. */
    onFocusIn(): void;
    /** Handles focusout events for the menu trigger. */
    onFocusOut(event: FocusEvent): void;
    /** Opens the menu. */
    open(opts?: {
        first?: boolean;
        last?: boolean;
    }): void;
    /** Closes the menu. */
    close(opts?: {
        refocus?: boolean;
    }): void;
}
/** The menu item ui pattern class. */
declare class MenuItemPattern<V> implements ListItem<V> {
    readonly inputs: MenuItemInputs<V>;
    /** The value of the menu item. */
    value: SignalLike<V>;
    /** The unique ID of the menu item. */
    id: SignalLike<string>;
    /** Whether the menu item is disabled. */
    disabled: () => boolean;
    /** The search term for the menu item. */
    searchTerm: SignalLike<string>;
    /** The element of the menu item. */
    element: SignalLike<HTMLElement | undefined>;
    /** Whether the menu item is active. */
    active: SignalLike<boolean>;
    /** Whether the menu item has received focus. */
    hasBeenFocused: WritableSignalLike<boolean>;
    /** The tab index of the menu item. */
    tabIndex: SignalLike<0 | -1>;
    /** The position of the menu item in the menu. */
    index: SignalLike<number>;
    /** Whether the menu item is expanded. */
    expanded: SignalLike<boolean | null>;
    /** Whether the menu item is expanded. */
    _expanded: WritableSignalLike<boolean>;
    /** The ID of the menu that the menu item controls. */
    controls: WritableSignalLike<string | undefined>;
    /** The role of the menu item. */
    role: () => string;
    /** Whether the menu item has a popup. */
    hasPopup: SignalLike<boolean>;
    /** The submenu associated with the menu item. */
    submenu: SignalLike<MenuPattern<V> | undefined>;
    /** Whether the menu item is selectable. */
    selectable: SignalLike<boolean>;
    constructor(inputs: MenuItemInputs<V>);
    /** Opens the submenu. */
    open(opts?: {
        first?: boolean;
        last?: boolean;
    }): void;
    /** Closes the submenu. */
    close(opts?: {
        refocus?: boolean;
    }): void;
    /** Handles focusin events for the menu item. */
    onFocusIn(): void;
}

export { MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern };
export type { MenuBarInputs, MenuInputs, MenuItemInputs, MenuTriggerInputs };
