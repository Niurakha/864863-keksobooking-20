'use strict';

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('button');
var cardTemplate = document.querySelector('#card').content.querySelector('article');
var popupPhoto = cardTemplate.querySelector('.popup__photo');
var mapFiltersContainer = document.querySelector('.map__filters-container');

var listsDescription = {
  TYPE_LIST: ['palace', 'flat', 'house', 'bungalo'],
  FEATURES_LIST: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  PHOTOS_LIST: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};

var ACCOMMODATION = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
}
var NUMBER_OF_AD = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var AVATAR_FILE_PATH = 'img/avatars/user0';
var AVATAR_FORMAT = '.png';
var IMG_WIDTH = 45;
var IMG_HEIGHT = 45;
var IMG_ALT = 'Фотография жилья';

// генерируем случайное число

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// генерируем случайный элемент массива

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// создаем объект

var makeAd = function (count) {
  var mapWidth = document.querySelector('.map__pins').offsetWidth;
  var locationX = getRandomInt(0, mapWidth);
  var locationY = getRandomInt(130, 630);
  return {
    'author': {
      avatar: AVATAR_FILE_PATH + (count + 1) + AVATAR_FORMAT
    },
    'offer': {
      title: 'Заголовок предложения',
      address: [locationX, locationY].join(','),
      price: getRandomInt(500, 10000),
      type: getRandomElement(listsDescription.TYPE_LIST),
      rooms: getRandomInt(1, 6),
      guests: getRandomInt(1, 10),
      checkin: getRandomInt(12, 14) + ':00',
      checkout: getRandomInt(12, 14) + ':00',
      features: listsDescription.FEATURES_LIST,
      description: 'Описание',
      photos: listsDescription.PHOTOS_LIST
    },
    'location': {
      x: locationX,
      y: locationY
    }
  };
};

// создаем массив из объектов

var generateAds = function () {
  var ads = [];
  for (var i = 0; i < NUMBER_OF_AD; i++) {
    ads.push(makeAd(i));
  }
  return ads;
};

var advt = generateAds();

// временно переключаем карту в активное состояние
var showMap = function () {
  map.classList.remove('map--faded');
};

// создаем DOM-элементы, соответствующие меткам на карте

var createPin = function (element) {
  var pin = pinTemplate.cloneNode(true);
  var pinPicture = pin.querySelector('img');
  pin.style.left = element.location.x - (PIN_WIDTH / 2) + 'px';
  pin.style.top = element.location.y - PIN_HEIGHT + 'px';
  pinPicture.src = element.author.avatar;
  pinPicture.alt = element.offer.title;
  return pin;
};

var renderPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advt.length; i++) {
    fragment.appendChild(createPin(advt[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

showMap();
renderPins();

// создаем DOM-элемент объявления (карточка объявления)

// создаем фрагмент удобств
var createFeatureFragment = function (adData) {
  var featureFragment = document.createDocumentFragment();
  for (var i = 0; i < adData.offer.features.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature');
    featureItem.classList.add('popup__feature--' + adData.offer.features[i]);
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
  var cardAd = cardTemplate.cloneNode(true);

  // заменяем аватар
  if (card.author.avatar) {
    cardAd.querySelector('.popup__avatar').src = card.author.avatar;
  } else {
    cardAd.querySelector('.popup__avatar').remove();
  }

  if (card.offer) {
    if (card.offer.title) {
      // выводим заголовок в .popup__title
      cardAd.querySelector('.popup__title').textContent = card.offer.title;
    } else {
      cardAd.querySelector('.popup__title').remove();
    }

    if (card.offer.address) {
      // выводим адрес в .popup__text--address
      cardAd.querySelector('.popup__text--address').textContent = card.offer.address;
    } else {
      cardAd.querySelector('.popup__text--address').remove();
    }

    if (card.offer.price) {
      // выводим цену в .popup__text--price
      cardAd.querySelector('.popup__text--price').textContent = card.offer.price + ' ₽/ночь';
    } else {
      cardAd.querySelector('.popup__text--price').remove();
    }

    if (card.offer.type) {
      // выводим тип жилья в .popup__type
      cardAd.querySelector('.popup__type').textContent = ACCOMMODATION[card.offer.type];
    } else {
      cardAd.querySelector('.popup__type').remove();
    }

    if (card.offer.rooms && card.offer.guests) {
      // выводим количество комнат и гостей в .popup__text--capacity
      cardAd.querySelector('.popup__text--capacity').textContent = card.offer.rooms +
        ' комнаты для ' + card.offer.guests + ' гостей';
    } else {
      cardAd.querySelector('.popup__text--capacity').remove();
    }

    if (card.offer.checkin && card.offer.checkout) {
      // выводим время заезда и выезда в .popup__text--time
      cardAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin +
        ', выезд до ' + card.offer.checkout;
    } else {
      cardAd.querySelector('.popup__text--time').remove();
    }

    if (card.offer.features) {
      // выводим все доступные удобства в .popup__features
      cardAd.querySelector('.popup__features').innerHTML = '';
      cardAd.querySelector('.popup__features').appendChild(createFeatureFragment(card));
    } else {
      cardAd.querySelector('.popup__features').remove();
    }

    if (card.offer.description) {
      // выводим описание объекта недвижимости в .popup__description
      cardAd.querySelector('.popup__description').textContent = card.offer.description;
    } else {
      cardAd.querySelector('.popup__description').remove();
    }
    if (card.offer.photos) {
      // выводим фотографии в .popup__photos
      cardAd.querySelector('.popup__photos').removeChild(cardAd.querySelector('.popup__photo'));
      cardAd.querySelector('.popup__photos').appendChild(createPhotosFragment(card));
    } else {
      cardAd.querySelector('.popup__photos').remove();
    }
  }
  return cardAd;
};

map.insertBefore(createCard(advt[0]), mapFiltersContainer);
