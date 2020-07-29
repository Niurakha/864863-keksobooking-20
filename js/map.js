'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapFilter = document.querySelector('.map__filters');
  var mapSelects = mapFilter.querySelectorAll('select');
  var featureInputs = mapFilter.querySelectorAll('input[name="features"]');

  var setEnabled = function () {
    window.pins.loadAds();
    map.classList.remove('map--faded');

    window.utils.changeAccessibility(mapSelects, false);
    window.utils.changeAccessibility(window.form.adFormFieldsets, false);
    window.utils.changeAccessibility(featureInputs, false);
    window.validation.getRoomValidated();
  };
  var setDisabled = function () {
    map.classList.add('map--faded');

    window.utils.changeAccessibility(mapSelects, true);
    window.utils.changeAccessibility(window.form.adFormFieldsets, true);
    window.utils.changeAccessibility(featureInputs, true);

    window.pins.removePins();
    window.pins.moveMainPinToCenter();

    window.form.setPositionMainPin();
  };

  setDisabled();

  window.map = {
    setEnabled: setEnabled,
    setDisabled: setDisabled,
    map: map
  };
})();
