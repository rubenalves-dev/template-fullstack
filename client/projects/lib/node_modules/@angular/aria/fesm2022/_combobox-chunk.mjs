import { signal, computed, KeyboardEventManager } from './_signal-like-chunk.mjs';
import { PointerEventManager } from './_pointer-event-manager-chunk.mjs';

class ComboboxPattern {
  inputs;
  expanded = signal(false);
  disabled = () => this.inputs.disabled();
  activeDescendant = computed(() => {
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return null;
    }
    return popupControls?.activeId() ?? null;
  });
  highlightedItem = signal(undefined);
  isDeleting = false;
  isFocused = signal(false);
  hasBeenFocused = signal(false);
  expandKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
  collapseKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
  popupId = computed(() => this.inputs.popupControls()?.id() || null);
  autocomplete = computed(() => this.inputs.filterMode() === 'highlight' ? 'both' : 'list');
  hasPopup = computed(() => this.inputs.popupControls()?.role() || null);
  readonly = computed(() => this.inputs.readonly() || this.inputs.disabled() || null);
  listControls = () => {
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return null;
    }
    return popupControls;
  };
  treeControls = () => {
    const popupControls = this.inputs.popupControls();
    if (popupControls?.role() === 'tree') {
      return popupControls;
    }
    return null;
  };
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    const popupControls = this.inputs.popupControls();
    if (!popupControls) {
      return manager;
    }
    if (popupControls instanceof ComboboxDialogPattern) {
      if (!this.expanded()) {
        manager.on('ArrowUp', () => this.open()).on('ArrowDown', () => this.open());
        if (this.readonly()) {
          manager.on('Enter', () => this.open()).on(' ', () => this.open());
        }
      }
      return manager;
    }
    if (!this.inputs.alwaysExpanded()) {
      manager.on('Escape', () => this.close({
        reset: !this.readonly()
      }));
    }
    if (!this.expanded()) {
      manager.on('ArrowDown', () => this.open({
        first: true
      })).on('ArrowUp', () => this.open({
        last: true
      }));
      if (this.readonly()) {
        manager.on('Enter', () => this.open({
          selected: true
        })).on(' ', () => this.open({
          selected: true
        }));
      }
      return manager;
    }
    manager.on('ArrowDown', () => this.next()).on('ArrowUp', () => this.prev()).on('Home', () => this.first()).on('End', () => this.last());
    if (this.readonly()) {
      manager.on(' ', () => this.select({
        commit: true,
        close: !popupControls.multi()
      }));
    }
    if (popupControls.role() === 'listbox') {
      manager.on('Enter', () => {
        this.select({
          commit: true,
          close: !popupControls.multi()
        });
      });
    }
    const treeControls = this.treeControls();
    if (treeControls?.isItemSelectable()) {
      manager.on('Enter', () => this.select({
        commit: true,
        close: true
      }));
    }
    if (treeControls?.isItemExpandable()) {
      manager.on(this.expandKey(), () => this.expandItem()).on(this.collapseKey(), () => this.collapseItem());
      if (!treeControls.isItemSelectable()) {
        manager.on('Enter', () => this.expandItem());
      }
    }
    if (treeControls?.isItemCollapsible()) {
      manager.on(this.collapseKey(), () => this.collapseItem());
    }
    return manager;
  });
  click = computed(() => new PointerEventManager().on(e => {
    if (e.target === this.inputs.inputEl()) {
      if (this.readonly()) {
        this.expanded() ? this.close() : this.open({
          selected: true
        });
      }
    }
    const controls = this.inputs.popupControls();
    if (controls instanceof ComboboxDialogPattern) {
      return;
    }
    const item = controls?.getItem(e);
    if (item) {
      if (controls?.role() === 'tree') {
        const treeControls = controls;
        if (treeControls.isItemExpandable(item) && !treeControls.isItemSelectable(item)) {
          treeControls.toggleExpansion(item);
          this.inputs.inputEl()?.focus();
          return;
        }
      }
      this.select({
        item,
        commit: true,
        close: !controls?.multi()
      });
      this.inputs.inputEl()?.focus();
    }
  }));
  constructor(inputs) {
    this.inputs = inputs;
  }
  onKeydown(event) {
    if (!this.inputs.disabled()) {
      this.keydown().handle(event);
    }
  }
  onClick(event) {
    if (!this.inputs.disabled()) {
      this.click().handle(event);
    }
  }
  onInput(event) {
    if (this.inputs.disabled() || this.inputs.readonly()) {
      return;
    }
    const inputEl = this.inputs.inputEl();
    if (!inputEl) {
      return;
    }
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
    this.open();
    this.inputs.inputValue?.set(inputEl.value);
    this.isDeleting = event instanceof InputEvent && !!event.inputType.match(/^delete/);
    if (this.inputs.filterMode() === 'highlight' && !this.isDeleting) {
      this.highlight();
    }
  }
  onFocusIn() {
    if (this.inputs.alwaysExpanded() && !this.hasBeenFocused()) {
      const firstSelectedItem = this.listControls()?.getSelectedItems()[0];
      firstSelectedItem ? this.listControls()?.focus(firstSelectedItem) : this.first();
    }
    this.isFocused.set(true);
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    if (this.inputs.disabled()) {
      return;
    }
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
    if (!(event.relatedTarget instanceof HTMLElement) || !this.inputs.containerEl()?.contains(event.relatedTarget)) {
      this.isFocused.set(false);
      if (!this.expanded()) {
        return;
      }
      if (this.readonly()) {
        this.close();
        return;
      }
      if (this.inputs.filterMode() !== 'manual') {
        this.commit();
      } else {
        const item = popupControls?.items().find(i => i.searchTerm() === this.inputs.inputEl()?.value);
        if (item) {
          this.select({
            item
          });
        }
      }
      this.close();
    }
  }
  firstMatch = computed(() => {
    if (this.listControls()?.role() === 'listbox') {
      return this.listControls()?.items()[0];
    }
    return this.listControls()?.items().find(i => i.value() === this.inputs.firstMatch());
  });
  onFilter() {
    if (this.readonly()) {
      return;
    }
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
    const isInitialRender = !this.inputs.inputValue?.().length && !this.isDeleting;
    if (isInitialRender) {
      return;
    }
    if (!this.isFocused()) {
      return;
    }
    if (this.inputs.popupControls()?.role() === 'tree') {
      const treeControls = this.inputs.popupControls();
      this.inputs.inputValue?.().length ? treeControls.expandAll() : treeControls.collapseAll();
    }
    const item = this.firstMatch();
    if (!item) {
      popupControls?.clearSelection();
      popupControls?.unfocus();
      return;
    }
    popupControls?.focus(item);
    if (this.inputs.filterMode() !== 'manual') {
      this.select({
        item
      });
    }
    if (this.inputs.filterMode() === 'highlight' && !this.isDeleting) {
      this.highlight();
    }
  }
  highlight() {
    const inputEl = this.inputs.inputEl();
    const selectedItems = this.listControls()?.getSelectedItems();
    const item = selectedItems?.[0];
    if (!inputEl || !item) {
      return;
    }
    const isHighlightable = item.searchTerm().toLowerCase().startsWith(this.inputs.inputValue().toLowerCase());
    if (isHighlightable) {
      inputEl.value = this.inputs.inputValue() + item.searchTerm().slice(this.inputs.inputValue().length);
      inputEl.setSelectionRange(this.inputs.inputValue().length, item.searchTerm().length);
      this.highlightedItem.set(item);
    }
  }
  close(opts) {
    const popupControls = this.inputs.popupControls();
    if (this.inputs.alwaysExpanded()) {
      return;
    }
    if (popupControls instanceof ComboboxDialogPattern) {
      this.expanded.set(false);
      return;
    }
    if (this.readonly()) {
      this.expanded.set(false);
      popupControls?.unfocus();
      return;
    }
    if (!opts?.reset) {
      if (this.inputs.filterMode() === 'manual') {
        if (!this.listControls()?.items().some(i => i.searchTerm() === this.inputs.inputEl()?.value)) {
          this.listControls()?.clearSelection();
        }
      }
      this.expanded.set(false);
      popupControls?.unfocus();
      return;
    }
    if (!this.expanded()) {
      this.inputs.inputValue?.set('');
      popupControls?.clearSelection();
      const inputEl = this.inputs.inputEl();
      if (inputEl) {
        inputEl.value = '';
      }
    } else if (this.expanded()) {
      this.expanded.set(false);
      const selectedItem = popupControls?.getSelectedItems()?.[0];
      if (selectedItem?.searchTerm() !== this.inputs.inputValue()) {
        popupControls?.clearSelection();
      }
      return;
    }
    this.close();
    if (!this.readonly()) {
      popupControls?.clearSelection();
    }
  }
  open(nav) {
    this.expanded.set(true);
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
    const inputEl = this.inputs.inputEl();
    if (inputEl && this.inputs.filterMode() === 'highlight') {
      const isHighlighting = inputEl.selectionStart !== inputEl.value.length;
      this.inputs.inputValue?.set(inputEl.value.slice(0, inputEl.selectionStart || 0));
      if (!isHighlighting) {
        this.highlightedItem.set(undefined);
      }
    }
    if (nav?.first) {
      this.first();
    }
    if (nav?.last) {
      this.last();
    }
    if (nav?.selected) {
      const selectedItem = popupControls?.items().find(i => popupControls?.getSelectedItems().includes(i));
      if (selectedItem) {
        popupControls?.focus(selectedItem);
      }
    }
  }
  next() {
    this._navigate(() => this.listControls()?.next());
  }
  prev() {
    this._navigate(() => this.listControls()?.prev());
  }
  first() {
    this._navigate(() => this.listControls()?.first());
  }
  last() {
    this._navigate(() => this.listControls()?.last());
  }
  collapseItem() {
    const controls = this.inputs.popupControls();
    this._navigate(() => controls?.collapseItem());
  }
  expandItem() {
    const controls = this.inputs.popupControls();
    this._navigate(() => controls?.expandItem());
  }
  select(opts = {}) {
    const controls = this.listControls();
    const item = opts.item ?? controls?.getActiveItem();
    if (item?.disabled()) {
      return;
    }
    if (opts.item) {
      controls?.focus(opts.item, {
        focusElement: false
      });
    }
    controls?.multi() ? controls.toggle(opts.item) : controls?.select(opts.item);
    if (opts.commit) {
      this.commit();
    }
    if (opts.close) {
      this.close();
    }
  }
  commit() {
    const inputEl = this.inputs.inputEl();
    const selectedItems = this.listControls()?.getSelectedItems();
    if (!inputEl) {
      return;
    }
    inputEl.value = selectedItems?.map(i => i.searchTerm()).join(', ') || '';
    this.inputs.inputValue?.set(inputEl.value);
    if (this.inputs.filterMode() === 'highlight' && !this.readonly()) {
      const length = inputEl.value.length;
      inputEl.setSelectionRange(length, length);
    }
  }
  _navigate(operation) {
    operation();
    if (this.inputs.filterMode() !== 'manual') {
      this.select();
    }
    if (this.inputs.filterMode() === 'highlight') {
      const selectedItem = this.listControls()?.getSelectedItems()[0];
      if (!selectedItem) {
        return;
      }
      if (selectedItem === this.highlightedItem()) {
        this.highlight();
      } else {
        const inputEl = this.inputs.inputEl();
        inputEl.value = selectedItem?.searchTerm();
      }
    }
  }
}
class ComboboxDialogPattern {
  inputs;
  id = () => this.inputs.id();
  role = () => 'dialog';
  keydown = computed(() => {
    return new KeyboardEventManager().on('Escape', () => this.inputs.combobox.close());
  });
  constructor(inputs) {
    this.inputs = inputs;
  }
  onKeydown(event) {
    this.keydown().handle(event);
  }
  onClick(event) {
    if (event.target === this.inputs.element()) {
      this.inputs.combobox.close();
    }
  }
}

export { ComboboxDialogPattern, ComboboxPattern };
//# sourceMappingURL=_combobox-chunk.mjs.map
