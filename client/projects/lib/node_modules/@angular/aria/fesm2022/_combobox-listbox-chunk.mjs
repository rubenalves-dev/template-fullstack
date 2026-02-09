import { computed, signal, Modifier, KeyboardEventManager } from './_signal-like-chunk.mjs';
import { List } from './_list-chunk.mjs';
import { PointerEventManager } from './_pointer-event-manager-chunk.mjs';

class ListboxPattern {
  inputs;
  listBehavior;
  orientation;
  disabled = computed(() => this.listBehavior.disabled());
  readonly;
  tabIndex = computed(() => this.listBehavior.tabIndex());
  activeDescendant = computed(() => this.listBehavior.activeDescendant());
  multi;
  setsize = computed(() => this.inputs.items().length);
  followFocus = computed(() => this.inputs.selectionMode() === 'follow');
  wrap = signal(true);
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
  dynamicSpaceKey = computed(() => this.listBehavior.isTyping() ? '' : ' ');
  typeaheadRegexp = /^.$/;
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    if (this.readonly()) {
      return manager.on(this.prevKey, () => this.listBehavior.prev()).on(this.nextKey, () => this.listBehavior.next()).on('Home', () => this.listBehavior.first()).on('End', () => this.listBehavior.last()).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
    }
    if (!this.followFocus()) {
      manager.on(this.prevKey, () => this.listBehavior.prev()).on(this.nextKey, () => this.listBehavior.next()).on('Home', () => this.listBehavior.first()).on('End', () => this.listBehavior.last()).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
    }
    if (this.followFocus()) {
      manager.on(this.prevKey, () => this.listBehavior.prev({
        selectOne: true
      })).on(this.nextKey, () => this.listBehavior.next({
        selectOne: true
      })).on('Home', () => this.listBehavior.first({
        selectOne: true
      })).on('End', () => this.listBehavior.last({
        selectOne: true
      })).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key, {
        selectOne: true
      }));
    }
    if (this.inputs.multi()) {
      manager.on(Modifier.Any, 'Shift', () => this.listBehavior.anchor(this.listBehavior.activeIndex())).on(Modifier.Shift, this.prevKey, () => this.listBehavior.prev({
        selectRange: true
      })).on(Modifier.Shift, this.nextKey, () => this.listBehavior.next({
        selectRange: true
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'Home', () => this.listBehavior.first({
        selectRange: true,
        anchor: false
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'End', () => this.listBehavior.last({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, 'Enter', () => this.listBehavior.updateSelection({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, this.dynamicSpaceKey, () => this.listBehavior.updateSelection({
        selectRange: true,
        anchor: false
      }));
    }
    if (!this.followFocus() && this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => this.listBehavior.toggle()).on('Enter', () => this.listBehavior.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'A', () => this.listBehavior.toggleAll());
    }
    if (!this.followFocus() && !this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => this.listBehavior.toggleOne());
      manager.on('Enter', () => this.listBehavior.toggleOne());
    }
    if (this.inputs.multi() && this.followFocus()) {
      manager.on([Modifier.Ctrl, Modifier.Meta], this.prevKey, () => this.listBehavior.prev()).on([Modifier.Ctrl, Modifier.Meta], this.nextKey, () => this.listBehavior.next()).on([Modifier.Ctrl, Modifier.Meta], ' ', () => this.listBehavior.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Enter', () => this.listBehavior.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Home', () => this.listBehavior.first()).on([Modifier.Ctrl, Modifier.Meta], 'End', () => this.listBehavior.last()).on([Modifier.Ctrl, Modifier.Meta], 'A', () => {
        this.listBehavior.toggleAll();
        this.listBehavior.select();
      });
    }
    return manager;
  });
  pointerdown = computed(() => {
    const manager = new PointerEventManager();
    if (this.readonly()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e)));
    }
    if (this.multi()) {
      manager.on(Modifier.Shift, e => this.listBehavior.goto(this._getItem(e), {
        selectRange: true
      }));
    }
    if (!this.multi() && this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        selectOne: true
      }));
    }
    if (!this.multi() && !this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        toggle: true
      }));
    }
    if (this.multi() && this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        selectOne: true
      })).on(Modifier.Ctrl, e => this.listBehavior.goto(this._getItem(e), {
        toggle: true
      }));
    }
    if (this.multi() && !this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        toggle: true
      }));
    }
    return manager;
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.readonly = inputs.readonly;
    this.orientation = inputs.orientation;
    this.multi = inputs.multi;
    this.listBehavior = new List(inputs);
  }
  validate() {
    const violations = [];
    if (!this.inputs.multi() && this.inputs.values().length > 1) {
      violations.push(`A single-select listbox should not have multiple selected options. Selected options: ${this.inputs.values().join(', ')}`);
    }
    return violations;
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
  setDefaultState() {
    let firstItem = null;
    for (const item of this.inputs.items()) {
      if (this.listBehavior.isFocusable(item)) {
        if (!firstItem) {
          firstItem = item;
        }
        if (item.selected()) {
          this.inputs.activeItem.set(item);
          return;
        }
      }
    }
    if (firstItem) {
      this.inputs.activeItem.set(firstItem);
    }
  }
  _getItem(e) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const element = e.target.closest('[role="option"]');
    return this.inputs.items().find(i => i.element() === element);
  }
}

class OptionPattern {
  id;
  value;
  index = computed(() => this.listbox()?.inputs.items().indexOf(this) ?? -1);
  active = computed(() => this.listbox()?.inputs.activeItem() === this);
  selected = computed(() => this.listbox()?.inputs.values().includes(this.value()));
  selectable = () => true;
  disabled;
  searchTerm;
  listbox;
  tabIndex = computed(() => this.listbox()?.listBehavior.getItemTabindex(this));
  element;
  constructor(args) {
    this.id = args.id;
    this.value = args.value;
    this.listbox = args.listbox;
    this.element = args.element;
    this.disabled = args.disabled;
    this.searchTerm = args.searchTerm;
  }
}

class ComboboxListboxPattern extends ListboxPattern {
  inputs;
  id = computed(() => this.inputs.id());
  role = computed(() => 'listbox');
  activeId = computed(() => this.listBehavior.activeDescendant());
  items = computed(() => this.inputs.items());
  tabIndex = () => -1;
  multi = computed(() => {
    return this.inputs.combobox()?.readonly() ? this.inputs.multi() : false;
  });
  constructor(inputs) {
    if (inputs.combobox()) {
      inputs.focusMode = () => 'activedescendant';
      inputs.element = inputs.combobox().inputs.inputEl;
    }
    super(inputs);
    this.inputs = inputs;
  }
  onKeydown(_) {}
  onPointerdown(_) {}
  setDefaultState() {}
  focus = (item, opts) => {
    this.listBehavior.goto(item, opts);
  };
  getActiveItem = () => this.inputs.activeItem();
  next = () => this.listBehavior.next();
  prev = () => this.listBehavior.prev();
  last = () => this.listBehavior.last();
  first = () => this.listBehavior.first();
  unfocus = () => this.listBehavior.unfocus();
  select = item => this.listBehavior.select(item);
  toggle = item => this.listBehavior.toggle(item);
  clearSelection = () => this.listBehavior.deselectAll();
  getItem = e => this._getItem(e);
  getSelectedItems = () => {
    const items = [];
    for (const value of this.inputs.values()) {
      const item = this.items().find(i => i.value() === value);
      if (item) {
        items.push(item);
      }
    }
    return items;
  };
  setValue = value => this.inputs.values.set(value ? [value] : []);
}

export { ComboboxListboxPattern, ListboxPattern, OptionPattern };
//# sourceMappingURL=_combobox-listbox-chunk.mjs.map
