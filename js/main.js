'use strict';

var listsDescription = {
  TYPE_LIST: ['palace', 'flat', 'house', 'bungalo'],
  FEATURES_LIST: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  PHOTOS_LIST: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};

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
var map = document.querySelector('.map');
var showMap = function () {
  map.classList.remove('map--faded');
};

// создаем DOM-элементы, соответствующие меткам на карте

var pinTemplate = document.querySelector('#pin').content.querySelector('button');

var createPin = function (offer) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = offer.location.x - (PIN_WIDTH / 2) + 'px';
  pin.style.top = offer.location.y - PIN_HEIGHT + 'px';
  pin.querySelector('img').src = offer.author.avatar;
  pin.querySelector('img').alt = offer.offer.title;
  return pin;
};

var renderPins = function (adverts) {
  var fragment = document.createDocumentFragment();
  adverts = advt;
  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(createPin(adverts[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

showMap();
renderPins();

// создаем DOM-элемент объявления (карточка объявления)

var cardTemplate = document.querySelector('#card').content.querySelector('article');

// создаем тип жилья
var createTypeCard = function (card) {
  switch (true) {
    case card.offer.type === 'flat':
      card.offer.type = 'Квартира';
      break;

    case card.offer.type === 'bungalo':
      card.offer.type = 'Бунгало';
      break;

    case card.offer.type === 'house':
      card.offer.type = 'Дом';
      break;
    case card.offer.type === 'palace':
      card.offer.type = 'Дворец';
      break;
  }
  return card.offer.type;
};

// создаем удобства в месте проживания
var createFeature = function (container, feature) {
  for (var i = 0; i < feature.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature');
    featureItem.classList.add('popup__feature--' + feature[i]);
    container.querySelector('.popup__features').appendChild(featureItem);
  }
};

// создаем фото жилья
var createPhoto = function (container, photos) {
  for (var i = 0; i < photos.length; i++) {
    var photosItem = document.createElement('img');
    photosItem.classList.add('popup__photo');
    container.querySelector('.popup__photo').src = photos[i];
    container.querySelector('.popup__photo').width = IMG_WIDTH;
    container.querySelector('.popup__photo').height = IMG_HEIGHT;
    container.querySelector('.popup__photo').alt = IMG_ALT;
    container.querySelector('.popup__photos').appendChild(photosItem);
  }
};

// создаем саму карточку объявления
var createCard = function (card) {
  var cardAd = cardTemplate.cloneNode(true);

  // заменяем аватар
  cardAd.querySelector('.popup__avatar').textContent = card.author.avatar || 'no value';

  // выводим заголовок в .popup__title
  cardAd.querySelector('.popup__title').textContent = card.offer.title || 'no value';

  // выводим адрес в .popup__text--address
  cardAd.querySelector('.popup__text--address').textContent = card.offer.address || 'no value';

  // выводим цену в .popup__text--price
  cardAd.querySelector('.popup__text--price').textContent = card.offer.price + ' ₽/ночь' || 'no value';

  // выводим тип жилья в .popup__type
  cardAd.querySelector('.popup__type').textContent = createTypeCard(card) || 'no value';

  // выводим количество комнат и гостей в .popup__text--capacity
  cardAd.querySelector('.popup__text--capacity').textContent = card.offer.rooms +
    ' комнаты для ' + card.offer.guests + ' гостей' || 'no value';

  // выводим время заезда и выезда в .popup__text--time
  cardAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin +
    ', выезд до ' + card.offer.checkout || 'no value';

  // выводим все доступные удобства в .popup__features
  cardAd.querySelector('.popup__features').textContent = createFeature(cardAd, card.offer.features) || 'no value';

  // выводим описание объекта недвижимости в .popup__description
  cardAd.querySelector('.popup__description').textContent = card.offer.description || 'no value';

  // выводим фотографии в .popup__photos
  cardAd.querySelector('.popup__photo').textContent = createPhoto(cardAd, card.offer.photos) || 'no value';

  var childElements = cardAd.querySelectorAll(':scope > *');
  childElements.forEach(function (element) {
    if (element.textContent === 'no value') {
      element.classList.add('visually-hidden');
    }
  });
  return cardAd;
};

var filters = document.querySelector('.map__filters-container');
map.insertBefore(createCard(advt[0]), filters);
