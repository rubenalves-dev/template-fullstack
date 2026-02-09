import { ListExpansion } from './_expansion-chunk.mjs';
import { ListFocus, ListNavigation } from './_list-navigation-chunk.mjs';
import { computed, KeyboardEventManager } from './_signal-like-chunk.mjs';
import { PointerEventManager } from './_pointer-event-manager-chunk.mjs';

const focusMode = () => 'roving';
class AccordionGroupPattern {
  inputs;
  navigationBehavior;
  focusBehavior;
  expansionBehavior;
  constructor(inputs) {
    this.inputs = inputs;
    this.focusBehavior = new ListFocus({
      ...inputs,
      focusMode
    });
    this.navigationBehavior = new ListNavigation({
      ...inputs,
      focusMode,
      focusManager: this.focusBehavior
    });
    this.expansionBehavior = new ListExpansion({
      ...inputs
    });
  }
  prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  keydown = computed(() => {
    return new KeyboardEventManager().on(this.prevKey, () => this.navigationBehavior.prev()).on(this.nextKey, () => this.navigationBehavior.next()).on('Home', () => this.navigationBehavior.first()).on('End', () => this.navigationBehavior.last()).on(' ', () => this.toggle()).on('Enter', () => this.toggle());
  });
  pointerdown = computed(() => {
    return new PointerEventManager().on(e => {
      const item = this.inputs.getItem(e.target);
      if (!item) return;
      this.navigationBehavior.goto(item);
      this.expansionBehavior.toggle(item);
    });
  });
  onKeydown(event) {
    this.keydown().handle(event);
  }
  onPointerdown(event) {
    this.pointerdown().handle(event);
  }
  onFocus(event) {
    const item = this.inputs.getItem(event.target);
    if (!item) return;
    if (!this.focusBehavior.isFocusable(item)) return;
    this.focusBehavior.focus(item);
  }
  toggle() {
    const activeItem = this.inputs.activeItem();
    if (activeItem === undefined) return;
    this.expansionBehavior.toggle(activeItem);
  }
}
class AccordionTriggerPattern {
  inputs;
  id = () => this.inputs.id();
  element = () => this.inputs.element();
  expandable = () => true;
  expanded;
  active = computed(() => this.inputs.accordionGroup().inputs.activeItem() === this);
  controls = computed(() => this.inputs.accordionPanel()?.inputs.id());
  tabIndex = computed(() => this.inputs.accordionGroup().focusBehavior.isFocusable(this) ? 0 : -1);
  disabled = computed(() => this.inputs.disabled() || this.inputs.accordionGroup().inputs.disabled());
  hardDisabled = computed(() => this.disabled() && !this.inputs.accordionGroup().inputs.softDisabled());
  index = computed(() => this.inputs.accordionGroup().inputs.items().indexOf(this));
  constructor(inputs) {
    this.inputs = inputs;
    this.expanded = inputs.expanded;
  }
  open() {
    this.inputs.accordionGroup().expansionBehavior.open(this);
  }
  close() {
    this.inputs.accordionGroup().expansionBehavior.close(this);
  }
  toggle() {
    this.inputs.accordionGroup().expansionBehavior.toggle(this);
  }
}
class AccordionPanelPattern {
  inputs;
  id;
  accordionTrigger;
  hidden;
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.accordionTrigger = inputs.accordionTrigger;
    this.hidden = computed(() => inputs.accordionTrigger()?.expanded() === false);
  }
}

export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern };
//# sourceMappingURL=_accordion-chunk.mjs.map
