'use strict';
(function () {
  var ACCOMMODATION = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var IMG_WIDTH = 45;
  var IMG_HEIGHT = 45;
  var IMG_ALT = 'Фотография жилья';

  var cardTemplate = document.querySelector('#card').content.querySelector('article');
  var popupPhoto = cardTemplate.querySelector('.popup__photo');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  // создаем DOM-элемент объявления (карточка объявления)

  // создаем фрагмент удобств
  var createFeatureFragment = function (adData) {
    var featureFragment = document.createDocumentFragment();
    for (var i = 0; i < adData.offer.features.length; i++) {
      var featureItem = document.createElement('li');
      featureItem.classList.add('popup__feature', 'popup__feature--' + adData.offer.features[i]);
      featureFragment.appendChild(featureItem);
    }
    return featureFragment;
  };

  // создаем фрагмент фото жилья
  var createPhotosFragment = function (adData) {
    var photosFragment = document.createDocumentFragment();
    for (var i = 0; i < adData.offer.photos.length; i++) {
      var popupPhotoItem = popupPhoto.cloneNode(true);
      popupPhotoItem.src = adData.offer.photos[i];
      popupPhotoItem.width = IMG_WIDTH;
      popupPhotoItem.height = IMG_HEIGHT;
      popupPhotoItem.alt = IMG_ALT;
      photosFragment.appendChild(popupPhotoItem);
    }
    return photosFragment;
  };

  var createCard = function (card) {
    if (!card.offer) {
      return null;
    }

    var cardAd = cardTemplate.cloneNode(true);

    // заменяем аватар
    var popupAvatar = cardAd.querySelector('.popup__avatar');
    if (card.author.avatar) {
      popupAvatar.src = card.author.avatar;
    } else {
      popupAvatar.remove();
    }
    // выводим заголовок в .popup__title
    var popupTitle = cardAd.querySelector('.popup__title');
    if (card.offer.title) {
      popupTitle.textContent = card.offer.title;
    } else {
      popupTitle.remove();
    }

    // выводим адрес в .popup__text--address
    var popupTextAddress = cardAd.querySelector('.popup__text--address');
    if (card.offer.address) {
      popupTextAddress.textContent = card.offer.address;
    } else {
      popupTextAddress.remove();
    }

    // выводим цену в .popup__text--price
    var popupPrice = cardAd.querySelector('.popup__text--price');
    if (card.offer.price) {
      popupPrice.textContent = card.offer.price + ' ₽/ночь';
    } else {
      popupPrice.remove();
    }

    // выводим тип жилья в .popup__type
    var popupType = cardAd.querySelector('.popup__type');
    if (card.offer.type) {
      popupType.textContent = ACCOMMODATION[card.offer.type];
    } else {
      popupType.remove();
    }

    // выводим количество комнат и гостей в .popup__text--capacity
    var popupCapacity = cardAd.querySelector('.popup__text--capacity');
    if (card.offer.rooms && card.offer.guests) {
      popupCapacity.textContent = card.offer.rooms +
        ' комнаты для ' + card.offer.guests + ' гостей';
    } else {
      popupCapacity.remove();
    }

    // выводим время заезда и выезда в .popup__text--time
    var popupTextTime = cardAd.querySelector('.popup__text--time');
    if (card.offer.checkin && card.offer.checkout) {
      popupTextTime.textContent = 'Заезд после ' + card.offer.checkin +
        ', выезд до ' + card.offer.checkout;
    } else {
      popupTextTime.remove();
    }

    // выводим все доступные удобства в .popup__features
    var popupFeatures = cardAd.querySelector('.popup__features');
    if (card.offer.features) {
      popupFeatures.innerHTML = '';
      popupFeatures.appendChild(createFeatureFragment(card));
    } else {
      popupFeatures.remove();
    }

    // выводим описание объекта недвижимости в .popup__description
    var popupDescription = cardAd.querySelector('.popup__description');
    if (card.offer.description) {
      popupDescription.textContent = card.offer.description;
    } else {
      popupDescription.remove();
    }

    // выводим фотографии в .popup__photos
    var popupPhotos = cardAd.querySelector('.popup__photos');
    if (card.offer.photos) {
      popupPhotos.removeChild(cardAd.querySelector('.popup__photo'));
      popupPhotos.appendChild(createPhotosFragment(card));
    } else {
      popupPhotos.remove();
    }

    return cardAd;
  };

  // var renderCard = createCard(window.advert.advt[0]);

  // if (renderCard) {
  //   window.pin.map.insertBefore(renderCard, mapFiltersContainer);
  // }

  var onCardEscapePress = function (evt) {
    if (evt.keyCode === window.data.KEYSCODE.escape) {
      closeCard();
    }
  };

  var closePopup = function (popup) {
    window.pin.map.removeChild(popup);
  };

  var closeCard = function (popup) {
    popup = document.querySelector('.popup');
    if (popup) {
      closePopup(popup);
      document.removeEventListener('keydown', onCardEscapePress);
    }
  };

  var showAd = function (pinNode) {
    closeCard();
    var index = window.pin.pins.findIndex(function (pin) {
      return pinNode.querySelector('img').src === pin.querySelector('img').src;
    });
    var ad = window.advert.advt[index];

    var renderCard = createCard(ad);
    if (renderCard) {
      window.pin.map.insertBefore(renderCard, mapFiltersContainer);
    }

    var closePopupButton = renderCard.querySelector('.popup__close');
    closePopupButton.addEventListener('click', function () {
      closeCard();
    });

    document.addEventListener('keydown', onCardEscapePress);
  };

  var onMapPinsContainerClick = function (evt) {
    var currentTarget = evt.target;
    var isMainPin = currentTarget.classList.contains('map__pin--main') ||
      currentTarget.parentNode.classList.contains('map__pin--main');

    if (isMainPin) {
      return;
    }

    if (currentTarget.classList.contains('map__pin')) {
      showAd(currentTarget);
      return;
    }

    if (currentTarget.parentNode.classList.contains('map__pin')) {
      showAd(currentTarget.parentNode);
    }
  };

  var mapPinsContainer = document.querySelector('.map__pins');
  mapPinsContainer.addEventListener('click', onMapPinsContainerClick);

  window.card = {
    mapFiltersContainer: mapFiltersContainer
  };
})();
