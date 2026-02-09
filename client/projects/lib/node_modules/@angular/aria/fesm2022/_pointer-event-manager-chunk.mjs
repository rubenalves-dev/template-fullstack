import { EventManager, Modifier, hasModifiers } from './_signal-like-chunk.mjs';

var MouseButton;
(function (MouseButton) {
  MouseButton[MouseButton["Main"] = 0] = "Main";
  MouseButton[MouseButton["Auxiliary"] = 1] = "Auxiliary";
  MouseButton[MouseButton["Secondary"] = 2] = "Secondary";
})(MouseButton || (MouseButton = {}));
class PointerEventManager extends EventManager {
  options = {
    preventDefault: false,
    stopPropagation: false
  };
  on(...args) {
    const {
      button,
      handler,
      modifiers
    } = this._normalizeInputs(...args);
    this.configs.push({
      handler,
      matcher: event => this._isMatch(event, button, modifiers),
      ...this.options
    });
    return this;
  }
  _normalizeInputs(...args) {
    if (args.length === 3) {
      return {
        button: args[0],
        modifiers: args[1],
        handler: args[2]
      };
    }
    if (args.length === 2) {
      return {
        button: MouseButton.Main,
        modifiers: args[0],
        handler: args[1]
      };
    }
    return {
      button: MouseButton.Main,
      modifiers: Modifier.None,
      handler: args[0]
    };
  }
  _isMatch(event, button, modifiers) {
    return button === (event.button ?? 0) && hasModifiers(event, modifiers);
  }
}

export { PointerEventManager };
//# sourceMappingURL=_pointer-event-manager-chunk.mjs.map
