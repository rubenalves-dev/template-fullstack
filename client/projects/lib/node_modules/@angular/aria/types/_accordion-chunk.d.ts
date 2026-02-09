import { KeyboardEventManager } from './_keyboard-event-manager-chunk.js';
import { PointerEventManager } from './_pointer-event-manager-chunk.js';
import { ListExpansionInputs, ListExpansion, ExpansionItem } from './_expansion-chunk.js';
import { ListNavigationInputs, ListFocusInputs, ListNavigation, ListFocus, SignalLike, ListNavigationItem, ListFocusItem, WritableSignalLike } from './_list-navigation-chunk.js';

/** Inputs of the AccordionGroupPattern. */
interface AccordionGroupInputs extends Omit<ListNavigationInputs<AccordionTriggerPattern> & ListFocusInputs<AccordionTriggerPattern> & Omit<ListExpansionInputs, 'items'>, 'focusMode'> {
    /** A function that returns the trigger associated with a given element. */
    getItem: (e: Element | null | undefined) => AccordionTriggerPattern | undefined;
}
/** A pattern controls the nested Accordions. */
declare class AccordionGroupPattern {
    readonly inputs: AccordionGroupInputs;
    /** Controls navigation for the group. */
    readonly navigationBehavior: ListNavigation<AccordionTriggerPattern>;
    /** Controls focus for the group. */
    readonly focusBehavior: ListFocus<AccordionTriggerPattern>;
    /** Controls expansion for the group. */
    readonly expansionBehavior: ListExpansion;
    constructor(inputs: AccordionGroupInputs);
    /** The key used to navigate to the previous accordion trigger. */
    prevKey: SignalLike<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key used to navigate to the next accordion trigger. */
    nextKey: SignalLike<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** The keydown event manager for the accordion trigger. */
    keydown: SignalLike<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerdown event manager for the accordion trigger. */
    pointerdown: SignalLike<PointerEventManager<PointerEvent>>;
    /** Handles keydown events on the trigger, delegating to the group if not disabled. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles pointerdown events on the trigger, delegating to the group if not disabled. */
    onPointerdown(event: PointerEvent): void;
    /** Handles focus events on the trigger. This ensures the tabbing changes the active index. */
    onFocus(event: FocusEvent): void;
    /** Toggles the expansion state of the active accordion item. */
    toggle(): void;
}
/** Inputs for the AccordionTriggerPattern. */
interface AccordionTriggerInputs extends Omit<ListNavigationItem & ListFocusItem, 'index'>, Omit<ExpansionItem, 'expandable'> {
    /** A local unique identifier for the trigger's corresponding panel. */
    panelId: SignalLike<string>;
    /** The parent accordion group that controls this trigger. */
    accordionGroup: SignalLike<AccordionGroupPattern>;
    /** The accordion panel controlled by this trigger. */
    accordionPanel: SignalLike<AccordionPanelPattern | undefined>;
}
/** A pattern controls the expansion state of an accordion. */
declare class AccordionTriggerPattern implements ListNavigationItem, ListFocusItem, ExpansionItem {
    readonly inputs: AccordionTriggerInputs;
    /** A unique identifier for this trigger. */
    readonly id: SignalLike<string>;
    /** A reference to the trigger element. */
    readonly element: SignalLike<HTMLElement>;
    /** Whether this trigger has expandable panel. */
    readonly expandable: SignalLike<boolean>;
    /** Whether the corresponding panel is expanded. */
    readonly expanded: WritableSignalLike<boolean>;
    /** Whether the trigger is active. */
    readonly active: SignalLike<boolean>;
    /** Id of the accordion panel controlled by the trigger. */
    readonly controls: SignalLike<string | undefined>;
    /** The tabindex of the trigger. */
    readonly tabIndex: SignalLike<-1 | 0>;
    /** Whether the trigger is disabled. Disabling an accordion group disables all the triggers. */
    readonly disabled: SignalLike<boolean>;
    /** Whether the trigger is hard disabled.  */
    readonly hardDisabled: SignalLike<boolean>;
    /** The index of the trigger within its accordion group. */
    readonly index: SignalLike<number>;
    constructor(inputs: AccordionTriggerInputs);
    /** Opens the accordion panel. */
    open(): void;
    /** Closes the accordion panel. */
    close(): void;
    /** Toggles the accordion panel. */
    toggle(): void;
}
/** Represents the required inputs for the AccordionPanelPattern. */
interface AccordionPanelInputs {
    /** A global unique identifier for the panel. */
    id: SignalLike<string>;
    /** A local unique identifier for the panel, matching its trigger's panelId. */
    panelId: SignalLike<string>;
    /** The parent accordion trigger that controls this panel. */
    accordionTrigger: SignalLike<AccordionTriggerPattern | undefined>;
}
/** Represents an accordion panel. */
declare class AccordionPanelPattern {
    readonly inputs: AccordionPanelInputs;
    /** A global unique identifier for the panel. */
    id: SignalLike<string>;
    /** The parent accordion trigger that controls this panel. */
    accordionTrigger: SignalLike<AccordionTriggerPattern | undefined>;
    /** Whether the accordion panel is hidden. True if the associated trigger is not expanded. */
    hidden: SignalLike<boolean>;
    constructor(inputs: AccordionPanelInputs);
}

export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern };
export type { AccordionGroupInputs, AccordionPanelInputs, AccordionTriggerInputs };
