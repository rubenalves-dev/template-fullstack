import { computed, KeyboardEventManager } from './_signal-like-chunk.mjs';
import { List } from './_list-chunk.mjs';

class ToolbarPattern {
  inputs;
  listBehavior;
  orientation;
  softDisabled;
  disabled = computed(() => this.listBehavior.disabled());
  tabIndex = computed(() => this.listBehavior.tabIndex());
  activeDescendant = computed(() => this.listBehavior.activeDescendant());
  activeItem = () => this.listBehavior.inputs.activeItem();
  _prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  _nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  _altPrevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    }
    return 'ArrowUp';
  });
  _altNextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    }
    return 'ArrowDown';
  });
  _keydown = computed(() => {
    const manager = new KeyboardEventManager();
    return manager.on(this._nextKey, () => this.listBehavior.next()).on(this._prevKey, () => this.listBehavior.prev()).on(this._altNextKey, () => this._groupNext()).on(this._altPrevKey, () => this._groupPrev()).on(' ', () => this.select()).on('Enter', () => this.select()).on('Home', () => this.listBehavior.first()).on('End', () => this.listBehavior.last());
  });
  _groupNext() {
    const currGroup = this.inputs.activeItem()?.group();
    const nextGroup = this.listBehavior.navigationBehavior.peekNext()?.group();
    if (!currGroup) {
      return;
    }
    if (currGroup !== nextGroup) {
      this.listBehavior.goto(this.listBehavior.navigationBehavior.peekFirst({
        items: currGroup.inputs.items()
      }));
      return;
    }
    this.listBehavior.next();
  }
  _groupPrev() {
    const currGroup = this.inputs.activeItem()?.group();
    const nextGroup = this.listBehavior.navigationBehavior.peekPrev()?.group();
    if (!currGroup) {
      return;
    }
    if (currGroup !== nextGroup) {
      this.listBehavior.goto(this.listBehavior.navigationBehavior.peekLast({
        items: currGroup.inputs.items()
      }));
      return;
    }
    this.listBehavior.prev();
  }
  _goto(e) {
    const item = this.inputs.getItem(e.target);
    if (item) {
      this.listBehavior.goto(item);
      this.select();
    }
  }
  select() {
    const group = this.inputs.activeItem()?.group();
    if (!group?.multi()) {
      group?.inputs.items().forEach(i => this.listBehavior.deselect(i));
    }
    this.listBehavior.toggle();
  }
  constructor(inputs) {
    this.inputs = inputs;
    this.orientation = inputs.orientation;
    this.softDisabled = inputs.softDisabled;
    this.listBehavior = new List({
      ...inputs,
      multi: () => true,
      focusMode: () => 'roving',
      selectionMode: () => 'explicit',
      typeaheadDelay: () => 0
    });
  }
  onKeydown(event) {
    if (this.disabled()) return;
    this._keydown().handle(event);
  }
  onPointerdown(event) {
    event.preventDefault();
  }
  onClick(event) {
    if (this.disabled()) return;
    this._goto(event);
  }
  setDefaultState() {
    const firstItem = this.listBehavior.navigationBehavior.peekFirst({
      items: this.inputs.items()
    });
    if (firstItem) {
      this.inputs.activeItem.set(firstItem);
    }
  }
}

class ToolbarWidgetPattern {
  inputs;
  id = () => this.inputs.id();
  element = () => this.inputs.element();
  disabled = () => this.inputs.disabled() || this.group()?.disabled() || false;
  group = () => this.inputs.group();
  toolbar = () => this.inputs.toolbar();
  tabIndex = computed(() => this.toolbar().listBehavior.getItemTabindex(this));
  searchTerm = () => '';
  value = () => this.inputs.value();
  selectable = () => true;
  index = computed(() => this.toolbar().inputs.items().indexOf(this) ?? -1);
  selected = computed(() => this.toolbar().listBehavior.inputs.values().includes(this.value()));
  active = computed(() => this.toolbar().activeItem() === this);
  constructor(inputs) {
    this.inputs = inputs;
  }
}

class ToolbarWidgetGroupPattern {
  inputs;
  disabled = () => this.inputs.disabled();
  toolbar = () => this.inputs.toolbar();
  multi = () => this.inputs.multi();
  searchTerm = () => '';
  value = () => '';
  selectable = () => true;
  element = () => undefined;
  constructor(inputs) {
    this.inputs = inputs;
  }
}

export { ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern };
//# sourceMappingURL=_toolbar-widget-group-chunk.mjs.map
