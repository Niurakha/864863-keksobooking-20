'use strict';

(function () {

  var DEBOUNCE_TIME = 500;
  var TABINDEX = '1';

  var lastTimeout = null;

  var changeAccessibility = function (controls, state) {
    controls.forEach(function (control) {
      control.disabled = state;
    });
  };

  var isEscKey = function (evt) {
    return evt.key === window.data.KEYSCODE.escape;
  };

  var isEnterKey = function (evt) {
    return evt.key === window.data.KEYSCODE.enter;
  };

  var addClickListener = function (popup, className) {
    var onPopupClick = function (evt) {
      if ((evt.target.classList.contains(className + '__message'))) {
        return;
      }

      popup.remove();
      document.removeEventListener('click', onPopupClick);
    };

    document.addEventListener('click', onPopupClick);
  };

  var addEscListener = function (popup) {
    var onPopupEscPress = function (evt) {
      popup.tabindex = TABINDEX;
      popup.focus();

      if (isEscKey(evt.key)) {
        popup.remove();
        document.removeEventListener('keydown', onPopupEscPress);
      }
    };

    document.addEventListener('keydown', onPopupEscPress);
  };

  var debounce = function (onTimeout) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(function () {
      onTimeout();
    }, DEBOUNCE_TIME);
  };

  window.utils = {
    changeAccessibility: changeAccessibility,
    debounce: debounce,
    isEnterKey: isEnterKey,
    addClickListener: addClickListener,
    addEscListener: addEscListener
  };
})();
