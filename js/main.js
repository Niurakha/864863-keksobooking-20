'use strict';

var listsDescription = {
  typeList: ['palace', 'flat', 'house', 'bungalo'],
  featuresList: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  photosList: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};

var mapWidth = document.querySelector('.map__pins').offsetWidth;
var NUMBER_OF_AD = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var AVATAR_FILE_PATH = 'img/avatars/user0';
var AVATAR_FORMAT = '.png';

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
      type: getRandomElement(listsDescription.typeList),
      rooms: getRandomInt(1, 6),
      guests: getRandomInt(1, 10),
      checkin: getRandomInt(12, 14) + ':00',
      checkout: getRandomInt(12, 14) + ':00',
      features: getRandomElement(listsDescription.featuresList),
      description: 'Описание',
      photos: getRandomElement(listsDescription.photosList)
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

// временно переключаем карту в активное состояние

var showMap = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
};

// создаем DOM-элементы

var template = document.querySelector('#pin').content.querySelector('button');

var createPin = function (offer) {
  var pin = template.cloneNode(true);
  pin.style.left = offer.location.x - (PIN_WIDTH / 2) + 'px';
  pin.style.top = offer.location.y - PIN_HEIGHT + 'px';
  pin.querySelector('img').src = offer.author.avatar;
  pin.querySelector('img').alt = 'Альтернативная подпись';
  return pin;
};

var renderPins = function (adverts) {
  var fragment = document.createDocumentFragment();
  adverts = generateAds();
  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(createPin(adverts[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

showMap();
renderPins(NUMBER_OF_AD);
