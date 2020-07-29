'use strict';

(function () {

  var PINS_MAX_AMOUNT = 5;
  var NO_TIP_HEIGHT = 0;

  var dataPin = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var mainPinSize = {
    WIDTH: 62,
    HEIGHT: 62,
    TIP_HEIGHT: 22
  };

  var mainPinInitialCoord = {
    TOP: 375,
    LEFT: 570
  };


  var mapPinMain = document.querySelector('.map__pin--main');
  var pinsContainer = document.querySelector('.map__pins');
  var advertisements = [];

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var onMapPinsContainerClick = function (evt) {
    var mapPinActive = document.querySelector('.map__pin--active');

    if (mapPinActive) {
      mapPinActive.classList.remove('map__pin--active');
    }

    var currentTarget = evt.target;
    var isMainPin = currentTarget.classList.contains('map__pin--main') ||
      currentTarget.parentNode.classList.contains('map__pin--main');

    if (isMainPin) {
      return;
    }

    if (currentTarget.classList.contains('map__pin')) {
      currentTarget.classList.add('map__pin--active');
      window.card.showCard(currentTarget);
      return;
    }

    if (currentTarget.parentNode.classList.contains('map__pin')) {
      currentTarget.parentNode.classList.add('map__pin--active');
      window.card.showCard(currentTarget.parentNode);
    }
  };

  // создаем DOM-элементы, соответствующие меткам на карте

  var createPin = function (adv) {
    var pin = pinTemplate.cloneNode(true);
    var pinPicture = pin.querySelector('img');
    pin.style.left = adv.location.x - dataPin.WIDTH + 'px';
    pin.style.top = adv.location.y - dataPin.HEIGHT + 'px';
    pinPicture.src = adv.author.avatar;
    pinPicture.alt = adv.offer.title;
    return pin;
  };

  var renderPins = function (advs) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < advs.length; i++) {
      fragment.appendChild(createPin(advs[i]));
    }
    pinsContainer.appendChild(fragment);
  };

  var loadAds = function () {
    window.backend.load(function (advs) {
      advs.forEach(function (adv) {
        if (adv.offer) {
          advertisements.push(adv);
        }
      });

      var shortAdvs = advertisements.slice(0, PINS_MAX_AMOUNT);
      renderPins(shortAdvs);
    });
  };

  pinsContainer.addEventListener('click', onMapPinsContainerClick);

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  var moveMainPinToCenter = function () {
    mapPinMain.style.top = mainPinInitialCoord.TOP + 'px';
    mapPinMain.style.left = mainPinInitialCoord.LEFT + 'px';
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (!evt.which === window.data.KEYSCODE.leftMouseButton) {
      return;
    }

    var startCoord = {
      x: evt.clientX,
      y: evt.clientY
    };

    window.form.setActive();
    window.map.setEnabled();

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoord.x - moveEvt.clientX,
        y: startCoord.y - moveEvt.clientY
      };

      startCoord = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinPosition = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };

      var mapBorder = {
        TOP: window.data.mapSize.MIN_Y - (mainPinSize.HEIGHT + mainPinSize.TIP_HEIGHT),
        BOTTOM: window.data.mapSize.MAX_Y - (mainPinSize.HEIGHT + mainPinSize.TIP_HEIGHT),
        LEFT: window.data.mapSize.MIN_X - mainPinSize.WIDTH / window.data.HALF_SIZE_DIVIDER,
        RIGHT: window.data.mapSize.MAX_X - mainPinSize.WIDTH / window.data.HALF_SIZE_DIVIDER
      };

      if (mainPinPosition.x >= mapBorder.LEFT && mainPinPosition.x <= mapBorder.RIGHT) {
        mapPinMain.style.left = mainPinPosition.x + 'px';
      }

      if (mainPinPosition.y >= mapBorder.TOP && mainPinPosition.y <= mapBorder.BOTTOM) {
        mapPinMain.style.top = mainPinPosition.y + 'px';
      }

      window.form.setPositionMainPin(getMainPinCoord(true));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mapPinMain.addEventListener('keydown', function (evt) {
    if (!window.utils.isEnterKey(evt)) {
      return;
    }
    window.form.setActive();
    window.map.setEnabled();
  });

  var getMainPinCoord = function (isNeedleActive) {
    var needleCoord = isNeedleActive ? mainPinSize.HEIGHT / window.data.HALF_SIZE_DIVIDER + mainPinSize.TIP_HEIGHT : NO_TIP_HEIGHT;
    var coordX = mapPinMain.offsetLeft + mainPinSize.WIDTH / window.data.HALF_SIZE_DIVIDER;
    var coordY = mapPinMain.offsetTop + mainPinSize.HEIGHT / window.data.HALF_SIZE_DIVIDER + needleCoord;

    return {
      x: coordX,
      y: coordY
    };
  };

  window.pins = {
    loadAds: loadAds,
    removePins: removePins,
    moveMainPinToCenter: moveMainPinToCenter,
    getMainPinCoord: getMainPinCoord,
    renderPins: renderPins,
    advertisements: advertisements,
    mainPinSize: mainPinSize,
    mapPinMain: mapPinMain

  };
})();
