import { computed, signal, Modifier, KeyboardEventManager } from './_signal-like-chunk.mjs';
import { ListExpansion } from './_expansion-chunk.mjs';
import { ListNavigation, ListFocus } from './_list-navigation-chunk.mjs';
import { ListSelection, ListTypeahead } from './_list-typeahead-chunk.mjs';
import { PointerEventManager } from './_pointer-event-manager-chunk.mjs';

class TreeListFocus extends ListFocus {
  isFocusable(item) {
    return super.isFocusable(item) && item.visible();
  }
}
class Tree {
  inputs;
  navigationBehavior;
  selectionBehavior;
  typeaheadBehavior;
  focusBehavior;
  expansionBehavior;
  disabled = computed(() => this.focusBehavior.isListDisabled());
  activeDescendant = computed(() => this.focusBehavior.getActiveDescendant());
  tabIndex = computed(() => this.focusBehavior.getListTabIndex());
  activeIndex = computed(() => this.focusBehavior.activeIndex());
  _anchorIndex = signal(0);
  _wrap = signal(true);
  constructor(inputs) {
    this.inputs = inputs;
    this.focusBehavior = new TreeListFocus(inputs);
    this.selectionBehavior = new ListSelection({
      ...inputs,
      focusManager: this.focusBehavior
    });
    this.typeaheadBehavior = new ListTypeahead({
      ...inputs,
      focusManager: this.focusBehavior
    });
    this.expansionBehavior = new ListExpansion(inputs);
    this.navigationBehavior = new ListNavigation({
      ...inputs,
      focusManager: this.focusBehavior,
      wrap: computed(() => this._wrap() && this.inputs.wrap())
    });
  }
  getItemTabindex(item) {
    return this.focusBehavior.getItemTabIndex(item);
  }
  first(opts) {
    this._navigate(opts, () => this.navigationBehavior.first(opts));
  }
  last(opts) {
    this._navigate(opts, () => this.navigationBehavior.last(opts));
  }
  next(opts) {
    this._navigate(opts, () => this.navigationBehavior.next(opts));
  }
  prev(opts) {
    this._navigate(opts, () => this.navigationBehavior.prev(opts));
  }
  firstChild(opts) {
    this._navigate(opts, () => {
      const item = this.inputs.activeItem();
      const items = item?.children?.() ?? [];
      return this.navigationBehavior.first({
        items,
        ...opts
      });
    });
  }
  lastChild(opts) {
    this._navigate(opts, () => {
      const item = this.inputs.activeItem();
      const items = item?.children?.() ?? [];
      return this.navigationBehavior.last({
        items,
        ...opts
      });
    });
  }
  nextSibling(opts) {
    this._navigate(opts, () => {
      const item = this.inputs.activeItem();
      const items = item?.parent?.()?.children?.() ?? [];
      return this.navigationBehavior.next({
        items,
        ...opts
      });
    });
  }
  prevSibling(opts) {
    this._navigate(opts, () => {
      const item = this.inputs.activeItem();
      const items = item?.parent?.()?.children?.() ?? [];
      return this.navigationBehavior.prev({
        items,
        ...opts
      });
    });
  }
  parent(opts) {
    this._navigate(opts, () => this.navigationBehavior.goto(this.inputs.activeItem()?.parent?.(), opts));
  }
  goto(item, opts) {
    this._navigate(opts, () => this.navigationBehavior.goto(item, opts));
  }
  unfocus() {
    this.inputs.activeItem.set(undefined);
  }
  anchor(index) {
    this._anchorIndex.set(index);
  }
  search(char, opts) {
    this._navigate(opts, () => this.typeaheadBehavior.search(char));
  }
  isTyping() {
    return this.typeaheadBehavior.isTyping();
  }
  select(item) {
    this.selectionBehavior.select(item);
  }
  selectOne() {
    this.selectionBehavior.selectOne();
  }
  deselect(item) {
    this.selectionBehavior.deselect(item);
  }
  deselectAll() {
    this.selectionBehavior.deselectAll();
  }
  toggle(item) {
    this.selectionBehavior.toggle(item);
  }
  toggleOne() {
    this.selectionBehavior.toggleOne();
  }
  toggleAll() {
    this.selectionBehavior.toggleAll();
  }
  toggleExpansion(item) {
    item ??= this.inputs.activeItem();
    if (!item || !this.isFocusable(item)) return;
    if (this.isExpandable(item)) {
      this.expansionBehavior.toggle(item);
    }
  }
  expand(item) {
    if (this.isExpandable(item)) {
      this.expansionBehavior.open(item);
    }
  }
  collapse(item) {
    this.expansionBehavior.close(item);
  }
  expandSiblings(item) {
    item ??= this.inputs.activeItem();
    if (!item) return;
    const parent = item.parent?.();
    const siblings = parent ? parent.children?.() : this.inputs.items().filter(i => !i.parent?.());
    siblings?.forEach(s => this.expand(s));
  }
  expandAll() {
    this.expansionBehavior.openAll();
  }
  collapseAll() {
    this.expansionBehavior.closeAll();
  }
  isFocusable(item) {
    return this.focusBehavior.isFocusable(item);
  }
  isExpandable(item) {
    return this.expansionBehavior.isExpandable(item);
  }
  updateSelection(opts = {
    anchor: true
  }) {
    if (opts.toggle) {
      this.selectionBehavior.toggle();
    }
    if (opts.select) {
      this.selectionBehavior.select();
    }
    if (opts.selectOne) {
      this.selectionBehavior.selectOne();
    }
    if (opts.selectRange) {
      this.selectionBehavior.selectRange();
    }
    if (!opts.anchor) {
      this.anchor(this.selectionBehavior.rangeStartIndex());
    }
  }
  _navigate(opts = {}, operation) {
    if (opts?.selectRange) {
      this._wrap.set(false);
      this.selectionBehavior.rangeStartIndex.set(this._anchorIndex());
    }
    const moved = operation();
    if (moved) {
      this.updateSelection(opts);
    }
    this._wrap.set(true);
  }
}

class TreeItemPattern {
  inputs;
  id = () => this.inputs.id();
  value = () => this.inputs.value();
  element = () => this.inputs.element();
  disabled = () => this.inputs.disabled();
  searchTerm = () => this.inputs.searchTerm();
  tree = () => this.inputs.tree();
  parent = computed(() => {
    const parent = this.inputs.parent();
    return parent instanceof TreeItemPattern ? parent : undefined;
  });
  children = () => this.inputs.children() ?? [];
  index = computed(() => this.tree().inputs.items().indexOf(this));
  expandable = () => this.inputs.hasChildren();
  selectable = () => this.inputs.selectable();
  expanded;
  level = computed(() => this.inputs.parent().level() + 1);
  visible = computed(() => this.inputs.parent().expanded() && this.inputs.parent().visible());
  setsize = computed(() => this.inputs.parent().children().length);
  posinset = computed(() => this.inputs.parent().children().indexOf(this) + 1);
  active = computed(() => this.tree().activeItem() === this);
  tabIndex = computed(() => this.tree().treeBehavior.getItemTabindex(this));
  selected = computed(() => {
    if (this.tree().nav()) {
      return undefined;
    }
    if (!this.selectable()) {
      return undefined;
    }
    return this.tree().values().includes(this.value());
  });
  current = computed(() => {
    if (!this.tree().nav()) {
      return undefined;
    }
    if (!this.selectable()) {
      return undefined;
    }
    return this.tree().values().includes(this.value()) ? this.tree().currentType() : undefined;
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.expanded = inputs.expanded;
  }
}
class TreePattern {
  inputs;
  treeBehavior;
  level = () => 0;
  expanded = () => true;
  visible = () => true;
  tabIndex = computed(() => this.treeBehavior.tabIndex());
  activeDescendant = computed(() => this.treeBehavior.activeDescendant());
  children = computed(() => this.inputs.items().filter(item => item.level() === this.level() + 1));
  followFocus = computed(() => this.inputs.selectionMode() === 'follow');
  isRtl = computed(() => this.inputs.textDirection() === 'rtl');
  prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
  });
  nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
  });
  collapseKey = computed(() => {
    if (this.inputs.orientation() === 'horizontal') {
      return 'ArrowUp';
    }
    return this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
  });
  expandKey = computed(() => {
    if (this.inputs.orientation() === 'horizontal') {
      return 'ArrowDown';
    }
    return this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
  });
  dynamicSpaceKey = computed(() => this.treeBehavior.isTyping() ? '' : ' ');
  typeaheadRegexp = /^.$/;
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    const tree = this.treeBehavior;
    manager.on(this.prevKey, () => tree.prev({
      selectOne: this.followFocus()
    })).on(this.nextKey, () => tree.next({
      selectOne: this.followFocus()
    })).on('Home', () => tree.first({
      selectOne: this.followFocus()
    })).on('End', () => tree.last({
      selectOne: this.followFocus()
    })).on(this.typeaheadRegexp, e => tree.search(e.key, {
      selectOne: this.followFocus()
    })).on(Modifier.Shift, '*', () => tree.expandSiblings()).on(this.expandKey, () => this._expandOrFirstChild({
      selectOne: this.followFocus()
    })).on(this.collapseKey, () => this._collapseOrParent({
      selectOne: this.followFocus()
    }));
    if (this.inputs.multi()) {
      manager.on(Modifier.Any, 'Shift', () => tree.anchor(this.treeBehavior.activeIndex())).on(Modifier.Shift, this.prevKey, () => tree.prev({
        selectRange: true
      })).on(Modifier.Shift, this.nextKey, () => tree.next({
        selectRange: true
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'Home', () => tree.first({
        selectRange: true,
        anchor: false
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'End', () => tree.last({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, 'Enter', () => tree.updateSelection({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, this.dynamicSpaceKey, () => tree.updateSelection({
        selectRange: true,
        anchor: false
      }));
    }
    if (!this.followFocus() && this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => tree.toggle()).on('Enter', () => tree.toggle(), {
        preventDefault: !this.nav()
      }).on([Modifier.Ctrl, Modifier.Meta], 'A', () => tree.toggleAll());
    }
    if (!this.followFocus() && !this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => tree.selectOne());
      manager.on('Enter', () => tree.selectOne(), {
        preventDefault: !this.nav()
      });
    }
    if (this.inputs.multi() && this.followFocus()) {
      manager.on([Modifier.Ctrl, Modifier.Meta], this.prevKey, () => tree.prev()).on([Modifier.Ctrl, Modifier.Meta], this.nextKey, () => tree.next()).on([Modifier.Ctrl, Modifier.Meta], this.expandKey, () => this._expandOrFirstChild()).on([Modifier.Ctrl, Modifier.Meta], this.collapseKey, () => this._collapseOrParent()).on([Modifier.Ctrl, Modifier.Meta], ' ', () => tree.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Enter', () => tree.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Home', () => tree.first()).on([Modifier.Ctrl, Modifier.Meta], 'End', () => tree.last()).on([Modifier.Ctrl, Modifier.Meta], 'A', () => {
        tree.toggleAll();
        tree.select();
      });
    }
    return manager;
  });
  pointerdown = computed(() => {
    const manager = new PointerEventManager();
    if (this.multi()) {
      manager.on(Modifier.Shift, e => this.goto(e, {
        selectRange: true
      }));
    }
    if (!this.multi()) {
      return manager.on(e => this.goto(e, {
        selectOne: true
      }));
    }
    if (this.multi() && this.followFocus()) {
      return manager.on(e => this.goto(e, {
        selectOne: true
      })).on(Modifier.Ctrl, e => this.goto(e, {
        toggle: true
      }));
    }
    if (this.multi() && !this.followFocus()) {
      return manager.on(e => this.goto(e, {
        toggle: true
      }));
    }
    return manager;
  });
  id = () => this.inputs.id();
  element = () => this.inputs.element();
  nav = () => this.inputs.nav();
  currentType = () => this.inputs.currentType();
  items = () => this.inputs.items();
  focusMode = () => this.inputs.focusMode();
  disabled = () => this.inputs.disabled();
  activeItem;
  softDisabled = () => this.inputs.softDisabled();
  wrap = () => this.inputs.wrap();
  orientation = () => this.inputs.orientation();
  textDirection = () => this.textDirection();
  multi = computed(() => this.nav() ? false : this.inputs.multi());
  selectionMode = () => this.inputs.selectionMode();
  typeaheadDelay = () => this.inputs.typeaheadDelay();
  values;
  constructor(inputs) {
    this.inputs = inputs;
    this.activeItem = inputs.activeItem;
    this.values = inputs.values;
    this.treeBehavior = new Tree({
      ...inputs,
      multi: this.multi,
      multiExpandable: () => true
    });
  }
  validate() {
    const violations = [];
    if (!this.inputs.multi() && this.inputs.values().length > 1) {
      violations.push(`A single-select tree should not have multiple selected options. Selected options: ${this.inputs.values().join(', ')}`);
    }
    return violations;
  }
  setDefaultState() {
    let firstItem;
    for (const item of this.inputs.items()) {
      if (!item.visible()) continue;
      if (!this.treeBehavior.isFocusable(item)) continue;
      if (firstItem === undefined) {
        firstItem = item;
      }
      if (item.selected()) {
        this.activeItem.set(item);
        return;
      }
    }
    if (firstItem !== undefined) {
      this.activeItem.set(firstItem);
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
  goto(e, opts) {
    const item = this._getItem(e);
    if (!item) return;
    this.treeBehavior.goto(item, opts);
    this.treeBehavior.toggleExpansion(item);
  }
  _expandOrFirstChild(opts) {
    const item = this.treeBehavior.inputs.activeItem();
    if (item && this.treeBehavior.isExpandable(item) && !item.expanded()) {
      this.treeBehavior.expand(item);
    } else {
      this.treeBehavior.firstChild(opts);
    }
  }
  _collapseOrParent(opts) {
    const item = this.treeBehavior.inputs.activeItem();
    if (item && this.treeBehavior.isExpandable(item) && item.expanded()) {
      this.treeBehavior.collapse(item);
    } else {
      this.treeBehavior.parent(opts);
    }
  }
  _getItem(event) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const element = event.target.closest('[role="treeitem"]');
    return this.inputs.items().find(i => i.element() === element);
  }
}

class ComboboxTreePattern extends TreePattern {
  inputs;
  toggleExpansion = item => this.treeBehavior.toggleExpansion(item);
  isItemCollapsible = () => this.inputs.activeItem()?.parent() instanceof TreeItemPattern;
  role = () => 'tree';
  activeId = computed(() => this.treeBehavior.activeDescendant());
  getActiveItem = () => this.inputs.activeItem();
  items = computed(() => this.inputs.items());
  tabIndex = () => -1;
  constructor(inputs) {
    if (inputs.combobox()) {
      inputs.multi = () => false;
      inputs.focusMode = () => 'activedescendant';
      inputs.element = inputs.combobox().inputs.inputEl;
    }
    super(inputs);
    this.inputs = inputs;
  }
  onKeydown(_) {}
  onPointerdown(_) {}
  setDefaultState() {}
  focus = item => this.treeBehavior.goto(item);
  next = () => this.treeBehavior.next();
  prev = () => this.treeBehavior.prev();
  last = () => this.treeBehavior.last();
  first = () => this.treeBehavior.first();
  unfocus = () => this.treeBehavior.unfocus();
  select = item => this.treeBehavior.select(item);
  toggle = item => this.treeBehavior.toggle(item);
  clearSelection = () => this.treeBehavior.deselectAll();
  getItem = e => this._getItem(e);
  getSelectedItems = () => this.inputs.items().filter(item => item.selected());
  setValue = value => this.inputs.values.set(value ? [value] : []);
  expandItem = () => this._expandOrFirstChild();
  collapseItem = () => this._collapseOrParent();
  isItemExpandable(item = this.inputs.activeItem()) {
    return item ? item.expandable() : false;
  }
  expandAll = () => this.treeBehavior.expandAll();
  collapseAll = () => this.treeBehavior.collapseAll();
  isItemSelectable = (item = this.inputs.activeItem()) => {
    return item ? item.selectable() : false;
  };
}

export { ComboboxTreePattern, TreeItemPattern, TreePattern };
//# sourceMappingURL=_combobox-tree-chunk.mjs.map
