import { ListExpansion } from './_expansion-chunk.mjs';
import { computed, signal, KeyboardEventManager } from './_signal-like-chunk.mjs';
import { ListFocus, ListNavigation } from './_list-navigation-chunk.mjs';
import { PointerEventManager } from './_pointer-event-manager-chunk.mjs';

class LabelControl {
  inputs;
  label = computed(() => this.inputs.label?.());
  labelledBy = computed(() => {
    const label = this.label();
    const labelledBy = this.inputs.labelledBy?.();
    const defaultLabelledBy = this.inputs.defaultLabelledBy();
    if (labelledBy && labelledBy.length > 0) {
      return labelledBy;
    }
    if (label) {
      return [];
    }
    return defaultLabelledBy;
  });
  constructor(inputs) {
    this.inputs = inputs;
  }
}

class TabPattern {
  inputs;
  id = () => this.inputs.id();
  index = computed(() => this.inputs.tablist().inputs.items().indexOf(this));
  value = () => this.inputs.value();
  disabled = () => this.inputs.disabled();
  element = () => this.inputs.element();
  expandable = () => true;
  expanded;
  active = computed(() => this.inputs.tablist().inputs.activeItem() === this);
  selected = computed(() => this.inputs.tablist().selectedTab() === this);
  tabIndex = computed(() => this.inputs.tablist().focusBehavior.getItemTabIndex(this));
  controls = computed(() => this.inputs.tabpanel()?.id());
  constructor(inputs) {
    this.inputs = inputs;
    this.expanded = inputs.expanded;
  }
  open() {
    return this.inputs.tablist().open(this);
  }
}
class TabPanelPattern {
  inputs;
  id = () => this.inputs.id();
  value = () => this.inputs.value();
  labelManager;
  hidden = computed(() => this.inputs.tab()?.expanded() === false);
  tabIndex = computed(() => this.hidden() ? -1 : 0);
  labelledBy = computed(() => this.labelManager.labelledBy().length > 0 ? this.labelManager.labelledBy().join(' ') : undefined);
  constructor(inputs) {
    this.inputs = inputs;
    this.labelManager = new LabelControl({
      ...inputs,
      defaultLabelledBy: computed(() => this.inputs.tab() ? [this.inputs.tab().id()] : [])
    });
  }
}
class TabListPattern {
  inputs;
  focusBehavior;
  navigationBehavior;
  expansionBehavior;
  activeTab = () => this.inputs.activeItem();
  selectedTab = signal(undefined);
  orientation = () => this.inputs.orientation();
  disabled = () => this.inputs.disabled();
  tabIndex = computed(() => this.focusBehavior.getListTabIndex());
  activeDescendant = computed(() => this.focusBehavior.getActiveDescendant());
  followFocus = computed(() => this.inputs.selectionMode() === 'follow');
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
    return new KeyboardEventManager().on(this.prevKey, () => this._navigate(() => this.navigationBehavior.prev(), this.followFocus())).on(this.nextKey, () => this._navigate(() => this.navigationBehavior.next(), this.followFocus())).on('Home', () => this._navigate(() => this.navigationBehavior.first(), this.followFocus())).on('End', () => this._navigate(() => this.navigationBehavior.last(), this.followFocus())).on(' ', () => this.open()).on('Enter', () => this.open());
  });
  pointerdown = computed(() => {
    return new PointerEventManager().on(e => this._navigate(() => this.navigationBehavior.goto(this._getItem(e)), true));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.focusBehavior = new ListFocus(inputs);
    this.navigationBehavior = new ListNavigation({
      ...inputs,
      focusManager: this.focusBehavior
    });
    this.expansionBehavior = new ListExpansion({
      ...inputs,
      multiExpandable: () => false
    });
  }
  setDefaultState() {
    let firstItem;
    for (const item of this.inputs.items()) {
      if (!this.focusBehavior.isFocusable(item)) continue;
      if (firstItem === undefined) {
        firstItem = item;
      }
      if (item.selected()) {
        this.inputs.activeItem.set(item);
        return;
      }
    }
    if (firstItem !== undefined) {
      this.inputs.activeItem.set(firstItem);
    }
  }
  onKeydown(event) {
    if (!this.disabled()) {
      this.keydown().handle(event);
    }
  }
  onPointerdown(event) {
    if (!this.disabled()) {
      this.pointerdown().handle(event);
    }
  }
  open(tab) {
    tab ??= this.activeTab();
    if (typeof tab === 'string') {
      tab = this.inputs.items().find(t => t.value() === tab);
    }
    if (tab === undefined) return false;
    const success = this.expansionBehavior.open(tab);
    if (success) {
      this.selectedTab.set(tab);
    }
    return success;
  }
  _navigate(op, shouldExpand = false) {
    const success = op();
    if (success && shouldExpand) {
      this.open();
    }
  }
  _getItem(e) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const element = e.target.closest('[role="tab"]');
    return this.inputs.items().find(i => i.element() === element);
  }
}

export { TabListPattern, TabPanelPattern, TabPattern };
//# sourceMappingURL=_tabs-chunk.mjs.map
