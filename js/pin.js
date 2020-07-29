'use strict';

(function () {
  var dataPin = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var adForm = document.querySelector('.ad-form');
  var mapPinMain = document.querySelector('.map__pin--main');
  var addressInput = adForm.querySelector('#address');
  var map = document.querySelector('.map');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');

  // создаем DOM-элементы, соответствующие меткам на карте

  var createPin = function (element) {
    var pin = pinTemplate.cloneNode(true);
    var pinPicture = pin.querySelector('img');
    pin.style.left = element.location.x - (dataPin.WIDTH / 2) + 'px';
    pin.style.top = element.location.y - dataPin.HEIGHT + 'px';
    pinPicture.src = element.author.avatar;
    pinPicture.alt = element.offer.title;
    return pin;
  };

  var renderPins = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.advert.advt.length; i++) {
      fragment.appendChild(createPin(window.advert.advt[i]));
    }
    document.querySelector('.map__pins').appendChild(fragment);
  };

  // запрещает заполнение полей формы

  var disableElements = function (element) {
    for (var i = 0; i < element.length; i++) {
      element[i].setAttribute('disabled', 'disabled');
    }
  };

  disableElements(adFormFieldsets);

  // переводит страницу в активное состояние

  var activatePage = function (evt) {
    if (evt.keyCode === window.data.KEYSCODE.enter || evt.which === window.data.KEYSCODE.leftMouseButton) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      for (var i = 0; i < adFormFieldsets.length; i++) {
        adFormFieldsets[i].removeAttribute('disabled');
      }
    }
    mapPinMain.removeEventListener('mousedown', activatePage);
    mapPinMain.removeEventListener('keydown', activatePage);
    positionMainPin();
    renderPins();
  };

  // активное состояние при нажатии левой кнопки мыши

  mapPinMain.addEventListener('mousedown', activatePage);

  // активное состояние при нажатием клавиши Enter

  mapPinMain.addEventListener('keydown', activatePage);

  // поле адреса по-умолчанию

  var positionMainPin = function () {
    addressInput.value = (mapPinMain.offsetLeft + window.data.dataMainPin.WIDTH / 2) +
      ', ' + (mapPinMain.offsetTop + window.data.dataMainPin.HEIGHT + window.data.dataMainPin.TIP_HEIGHT);
  };

  positionMainPin();

  var pinFragment = document.createDocumentFragment();

  var insertPins = function () {
    var pins = [];
    for (var i = 0; i < window.advert.advt.length; i++) {
      pins.push(createPin(window.advert.advt[i]));
      pinFragment.appendChild(pins[i]);
    }

    return pins;
  };

  var pins = insertPins();

  window.pin = {
    map: map,
    adForm: adForm,
    pins: pins,
  };
})();
