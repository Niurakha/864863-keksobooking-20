'use strict';

(function () {
  var priceInput = window.pin.adForm.querySelector('#price');
  var typeInput = window.pin.adForm.querySelector('#type');
  var checkInInput = window.pin.adForm.querySelector('#timein');
  var checkOutInput = window.pin.adForm.querySelector('#timeout');
  var roomsInput = window.pin.adForm.querySelector('#room_number');
  var guestsInput = window.pin.adForm.querySelector('#capacity');

  var price = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  // валидация

  // устанавливаем минимальную цену

  var setMinPrice = function (input, minPrice) {
    input.setAttribute('min', minPrice);
    input.placeholder = minPrice;
  };

  typeInput.addEventListener('change', function () {
    if (typeInput.value === 'bungalo') {
      setMinPrice(priceInput, price.BUNGALO);
    } else if (typeInput.value === 'flat') {
      setMinPrice(priceInput, price.FLAT);
    } else if (typeInput.value === 'house') {
      setMinPrice(priceInput, price.HOUSE);
    } else if (typeInput.value === 'palace') {
      setMinPrice(priceInput, price.PALACE);
    }
  });

  // синхронизировать время заезда и выезда

  checkInInput.addEventListener('input', function () {
    checkOutInput.value = checkInInput.value;
  });

  checkOutInput.addEventListener('input', function () {
    checkInInput.value = checkOutInput.value;
  });

  // зависимость количества гостей от количества комнат

  guestsInput.addEventListener('change', function () {
    if (roomsInput.value !== '100' && guestsInput.value === '0') {
      guestsInput.setCustomValidity('Укажите количество гостей');
    } else if (roomsInput.value < guestsInput.value) {
      guestsInput.setCustomValidity('Количество гостей не может быть больше количества комнат');
    } else if (roomsInput.value === '100' && guestsInput.value !== '0') {
      guestsInput.setCustomValidity('Это жилье не для гостей');
    } else {
      guestsInput.setCustomValidity('');
    }
  });

  // зависимость количества комнат  от количества гостей

  var getRoomValidated = function () {
    if (roomsInput.value === '100' && guestsInput.value !== '0') {
      roomsInput.setCustomValidity('Это жилье не для гостей');
    } else if (roomsInput.value < guestsInput.value) {
      roomsInput.setCustomValidity('Недостаточно места для выбранного количества гостей');
    } else if (roomsInput.value > guestsInput.value && roomsInput.value !== '100') {
      roomsInput.setCustomValidity('Это предложение для большего числа гостей');
    } else {
      roomsInput.setCustomValidity('');
    }
  };

  roomsInput.addEventListener('change', function () {
    getRoomValidated();
  });

  guestsInput.addEventListener('change', function () {
    getRoomValidated();
  });

})();
