'use strict';

(function () {
  var listsDescription = {
    TYPE_LIST: ['palace', 'flat', 'house', 'bungalo'],
    FEATURES_LIST: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    PHOTOS_LIST: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  };
  var AVATAR_FILE_PATH = 'img/avatars/user0';
  var AVATAR_FORMAT = '.png';

  // создаем объект

  var makeAd = function (count) {
    var mapWidth = document.querySelector('.map__pins').offsetWidth;
    var locationX = window.utils.getRandomInt(0, mapWidth);
    var locationY = window.utils.getRandomInt(130, 630);
    return {
      'author': {
        avatar: AVATAR_FILE_PATH + (count + 1) + AVATAR_FORMAT
      },
      'offer': {
        title: 'Заголовок предложения',
        address: [locationX, locationY].join(','),
        price: window.utils.getRandomInt(500, 10000),
        type: window.utils.getRandomElement(listsDescription.TYPE_LIST),
        rooms: window.utils.getRandomInt(1, 6),
        guests: window.utils.getRandomInt(1, 10),
        checkin: window.utils.getRandomInt(12, 14) + ':00',
        checkout: window.utils.getRandomInt(12, 14) + ':00',
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
    for (var i = 0; i < window.data.NUMBER_OF_AD; i++) {
      ads.push(makeAd(i));
    }
    return ads;
  };

  var advt = generateAds();

  window.advert = {
    advt: advt,
    generateAds: generateAds
  };


})();
