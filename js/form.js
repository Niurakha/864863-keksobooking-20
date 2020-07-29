'use strict';

(function () {

  var messageClass = {
    SUCCESS: 'success',
    ERROR: 'error'
  };

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var addressInput = adForm.querySelector('#address');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var main = document.querySelector('main');
  var formInputs = adForm.querySelectorAll('input, select');

  // поле адреса по-умолчанию

  var setPositionMainPin = function () {
    addressInput.value = Math.round(window.pins.mapPinMain.offsetLeft + (window.pins.mainPinSize.WIDTH / window.data.HALF_SIZE_DIVIDER))
      + ', ' + Math.round(window.pins.mapPinMain.offsetTop + (window.pins.mainPinSize.HEIGHT / window.data.HALF_SIZE_DIVIDER));
  };

  setPositionMainPin();

  var setAddressCoord = function (coord) {
    addressInput.value = Math.round(coord.x) + ', ' + Math.round(coord.y);
  };

  var removeHighlight = function (inputs) {
    inputs.forEach(function (input) {
      if (input.classList.contains('error-form')) {
        input.classList.remove('error-form');
      }
    });
  };

  var setActive = function () {
    if (!adForm.classList.contains('ad-form--disabled')) {
      return;
    }

    adForm.classList.remove('ad-form--disabled');
    window.utils.changeAccessibility(adFormFieldsets, false);
    setAddressCoord(window.pins.getMainPinCoord(true));
    window.photo.avatarChooser.addEventListener('change', window.photo.onAvatarUpload);
    window.photo.accomodationPicChooser.addEventListener('change', window.photo.onUpload);
  };

  var setInactive = function () {
    if (adForm.classList.contains('ad-form--disabled')) {
      return;
    }
    removeHighlight(formInputs);
    window.photo.resetInputs();
    adForm.classList.add('ad-form--disabled');
    window.utils.changeAccessibility(adFormFieldsets, true);
    adForm.reset();
  };

  setInactive();

  var createPopup = function (className) {
    var popupTemplate = document.querySelector('#' + className)
      .content
      .querySelector('.' + className);

    var popup = popupTemplate.cloneNode(true);
    main.appendChild(popup);

    window.utils.addClickListener(popup, className);
    window.utils.addEscListener(popup);
  };

  var onError = function () {
    createPopup(messageClass.ERROR);
  };

  var onSuccess = function () {
    createPopup(messageClass.SUCCESS);
    setInactive();
    window.map.setDisabled();
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.validation.checkFormFields(formInputs);
    window.validation.getRoomValidated();
    window.card.closeCard();
    window.backend.upload(new FormData(adForm), onSuccess, onError);
  };

  adForm.addEventListener('submit', onFormSubmit);

  var onFormReset = function (evt) {
    evt.preventDefault();
    window.card.closeCard();
    setInactive();
    window.map.setDisabled();
  };

  resetButton.addEventListener('mousedown', onFormReset);


  window.form = {
    setActive: setActive,
    setPositionMainPin: setPositionMainPin,
    onError: onError,
    adForm: adForm,
    adFormFieldsets: adFormFieldsets
  };

})();
