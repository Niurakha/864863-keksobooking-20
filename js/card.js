'use strict';

(function () {

  var ACCOMMODATION = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };


  var cardTemplate = document.querySelector('#card').content.querySelector('article');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var popupPhoto = cardTemplate.querySelector('.popup__photo');

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
      popupPhotoItem.width = window.data.cardPhoto.WIDTH;
      popupPhotoItem.height = window.data.cardPhoto.HEIGHT;
      popupPhotoItem.alt = window.data.cardPhoto.IMG_ALT;
      photosFragment.appendChild(popupPhotoItem);
    }
    return photosFragment;
  };

  // создаем DOM-элемент объявления (карточка объявления)

  var createCard = function (adv) {
    if (!adv.offer) {
      return null;
    }

    var cardAd = cardTemplate.cloneNode(true);

    // заменяем аватар
    var popupAvatar = cardAd.querySelector('.popup__avatar');
    if (adv.author.avatar) {
      popupAvatar.src = adv.author.avatar;
    } else {
      popupAvatar.remove();
    }
    // выводим заголовок в .popup__title
    var popupTitle = cardAd.querySelector('.popup__title');
    if (adv.offer.title) {
      popupTitle.textContent = adv.offer.title;
    } else {
      popupTitle.remove();
    }

    // выводим адрес в .popup__text--address
    var popupTextAddress = cardAd.querySelector('.popup__text--address');
    if (adv.offer.address) {
      popupTextAddress.textContent = adv.offer.address;
    } else {
      popupTextAddress.remove();
    }

    // выводим цену в .popup__text--price
    var popupPrice = cardAd.querySelector('.popup__text--price');
    if (adv.offer.price) {
      popupPrice.textContent = adv.offer.price + ' ₽/ночь';
    } else {
      popupPrice.remove();
    }

    // выводим тип жилья в .popup__type
    var popupType = cardAd.querySelector('.popup__type');
    if (adv.offer.type) {
      popupType.textContent = ACCOMMODATION[adv.offer.type];
    } else {
      popupType.remove();
    }

    // выводим количество комнат и гостей в .popup__text--capacity
    var popupCapacity = cardAd.querySelector('.popup__text--capacity');
    if (adv.offer.rooms && adv.offer.guests) {
      popupCapacity.textContent = adv.offer.rooms +
        ' комнаты для ' + adv.offer.guests + ' гостей';
    } else {
      popupCapacity.remove();
    }

    // выводим время заезда и выезда в .popup__text--time
    var popupTextTime = cardAd.querySelector('.popup__text--time');
    if (adv.offer.checkin && adv.offer.checkout) {
      popupTextTime.textContent = 'Заезд после ' + adv.offer.checkin +
        ', выезд до ' + adv.offer.checkout;
    } else {
      popupTextTime.remove();
    }

    // выводим все доступные удобства в .popup__features
    var popupFeatures = cardAd.querySelector('.popup__features');
    if (adv.offer.features) {
      popupFeatures.innerHTML = '';
      popupFeatures.appendChild(createFeatureFragment(adv));
    } else {
      popupFeatures.remove();
    }

    // выводим описание объекта недвижимости в .popup__description
    var popupDescription = cardAd.querySelector('.popup__description');
    if (adv.offer.description) {
      popupDescription.textContent = adv.offer.description;
    } else {
      popupDescription.remove();
    }

    // выводим фотографии в .popup__photos
    var popupPhotos = cardAd.querySelector('.popup__photos');
    if (adv.offer.photos) {
      popupPhotos.removeChild(cardAd.querySelector('.popup__photo'));
      popupPhotos.appendChild(createPhotosFragment(adv));
    } else {
      popupPhotos.remove();
    }

    return cardAd;
  };

  var onCardEscapePress = function (evt) {
    if (evt.keyCode === window.data.KEYSCODE.escape) {
      closeCard();
      var mapPinActive = document.querySelector('.map__pin--active');
      mapPinActive.classList.remove('map__pin--active');
    }
  };

  var closeCard = function (popup) {
    popup = document.querySelector('.popup');
    if (!popup) {
      return;
    }
    window.map.map.removeChild(popup);
    document.removeEventListener('keydown', onCardEscapePress);
  };

  var showCard = function (pinNode) {
    closeCard();
    var ad = window.pins.advertisements.find(function (pin) {
      return pinNode.querySelector('img').alt === pin.offer.title;
    });

    var renderCard = createCard(ad);
    if (renderCard) {
      window.map.map.insertBefore(renderCard, mapFiltersContainer);
    }

    var closePopupButton = renderCard.querySelector('.popup__close');
    closePopupButton.addEventListener('click', function () {
      closeCard();
      var mapPinActive = document.querySelector('.map__pin--active');
      mapPinActive.classList.remove('map__pin--active');
    });

    document.addEventListener('keydown', onCardEscapePress);
  };

  window.card = {
    showCard: showCard,
    closeCard: closeCard
  };

})();
