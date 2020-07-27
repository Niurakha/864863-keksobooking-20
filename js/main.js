'use strict';

var pinTemplate = document.querySelector('#pin').content.querySelector('button');
// var cardTemplate = document.querySelector('#card').content.querySelector('article');
// var popupPhoto = cardTemplate.querySelector('.popup__photo');
var map = document.querySelector('.map');
// var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var addressInput = adForm.querySelector('#address');
var priceInput = adForm.querySelector('#price');
var typeInput = adForm.querySelector('#type');
var checkInInput = adForm.querySelector('#timein');
var checkOutInput = adForm.querySelector('#timeout');
var roomsInput = adForm.querySelector('#room_number');
var guestsInput = adForm.querySelector('#capacity');

var listsDescription = {
  TYPE_LIST: ['palace', 'flat', 'house', 'bungalo'],
  FEATURES_LIST: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  PHOTOS_LIST: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};

// var ACCOMMODATION = {
//   flat: 'Квартира',
//   bungalo: 'Бунгало',
//   house: 'Дом',
//   palace: 'Дворец'
// };

var price = {
  BUNGALO: 0,
  FLAT: 1000,
  HOUSE: 5000,
  PALACE: 10000
};

var NUMBER_OF_AD = 8;

var dataPin = {
  WIDTH: 50,
  HEIGHT: 70
};

var dataMainPin = {
  WIDTH: 62,
  HEIGHT: 62,
  TIP_HEIGHT: 22
};

var AVATAR_FILE_PATH = 'img/avatars/user0';
var AVATAR_FORMAT = '.png';
// var IMG_WIDTH = 45;
// var IMG_HEIGHT = 45;
// var IMG_ALT = 'Фотография жилья';

var KEYSCODE = {
  leftMouseButton: 1,
  enter: 13,
  escape: 27
};

// запрещает заполнение полей формы

var disableElements = function (element) {
  for (var i = 0; i < element.length; i++) {
    element[i].setAttribute('disabled', 'disabled');
  }
};

disableElements(adFormFieldsets);

// переводит страницу в активное состояние

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].removeAttribute('disabled');
  }
  renderPins();
};

// поле адреса по-умолчанию

var positionMainPin = function () {
  addressInput.value = (mapPinMain.offsetLeft + dataMainPin.WIDTH / 2) +
    ', ' + (mapPinMain.offsetTop + dataMainPin.HEIGHT + dataMainPin.TIP_HEIGHT);
};

positionMainPin();

// активное состояние при нажатии левой кнопки мыши

mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.which === KEYSCODE.leftMouseButton) {
    evt.preventDefault();
    activatePage();
    positionMainPin();
  }
});

// активное состояние при нажатием клавиши Enter

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYSCODE.enter) {
    evt.preventDefault();
    activatePage();
    positionMainPin();
  }
});

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
  if (roomsInput.value === '100') {
    roomsInput.setCustomValidity('Это жилье не для гостей');
  } else if (roomsInput.value < guestsInput.value) {
    roomsInput.setCustomValidity('Недостаточно места для выбранного количества гостей');
  } else if (roomsInput.value > guestsInput.value) {
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
  for (var i = 0; i < advt.length; i++) {
    fragment.appendChild(createPin(advt[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

// // создаем DOM-элемент объявления (карточка объявления)

// // создаем фрагмент удобств
// var createFeatureFragment = function (adData) {
//   var featureFragment = document.createDocumentFragment();
//   for (var i = 0; i < adData.offer.features.length; i++) {
//     var featureItem = document.createElement('li');
//     featureItem.classList.add('popup__feature', 'popup__feature--' + adData.offer.features[i]);
//     featureFragment.appendChild(featureItem);
//   }
//   return featureFragment;
// };

// // создаем фрагмент фото жилья
// var createPhotosFragment = function (adData) {
//   var photosFragment = document.createDocumentFragment();
//   for (var i = 0; i < adData.offer.photos.length; i++) {
//     var popupPhotoItem = popupPhoto.cloneNode(true);
//     popupPhotoItem.src = adData.offer.photos[i];
//     popupPhotoItem.width = IMG_WIDTH;
//     popupPhotoItem.height = IMG_HEIGHT;
//     popupPhotoItem.alt = IMG_ALT;
//     photosFragment.appendChild(popupPhotoItem);
//   }
//   return photosFragment;
// };

// var createCard = function (card) {
//   if (!card.offer) {
//     return null;
//   }

//   var cardAd = cardTemplate.cloneNode(true);

//   // заменяем аватар
//   var popupAvatar = cardAd.querySelector('.popup__avatar');
//   if (card.author.avatar) {
//     popupAvatar.src = card.author.avatar;
//   } else {
//     popupAvatar.remove();
//   }
//   // выводим заголовок в .popup__title
//   var popupTitle = cardAd.querySelector('.popup__title');
//   if (card.offer.title) {
//     popupTitle.textContent = card.offer.title;
//   } else {
//     popupTitle.remove();
//   }

//   // выводим адрес в .popup__text--address
//   var popupTextAddress = cardAd.querySelector('.popup__text--address');
//   if (card.offer.address) {
//     popupTextAddress.textContent = card.offer.address;
//   } else {
//     popupTextAddress.remove();
//   }

//   // выводим цену в .popup__text--price
//   var popupPrice = cardAd.querySelector('.popup__text--price');
//   if (card.offer.price) {
//     popupPrice.textContent = card.offer.price + ' ₽/ночь';
//   } else {
//     popupPrice.remove();
//   }

//   // выводим тип жилья в .popup__type
//   var popupType = cardAd.querySelector('.popup__type');
//   if (card.offer.type) {
//     popupType.textContent = ACCOMMODATION[card.offer.type];
//   } else {
//     popupType.remove();
//   }

//   // выводим количество комнат и гостей в .popup__text--capacity
//   var popupCapacity = cardAd.querySelector('.popup__text--capacity');
//   if (card.offer.rooms && card.offer.guests) {
//     popupCapacity.textContent = card.offer.rooms +
//       ' комнаты для ' + card.offer.guests + ' гостей';
//   } else {
//     popupCapacity.remove();
//   }

//   // выводим время заезда и выезда в .popup__text--time
//   var popupTextTime = cardAd.querySelector('.popup__text--time');
//   if (card.offer.checkin && card.offer.checkout) {
//     popupTextTime.textContent = 'Заезд после ' + card.offer.checkin +
//       ', выезд до ' + card.offer.checkout;
//   } else {
//     popupTextTime.remove();
//   }

//   // выводим все доступные удобства в .popup__features
//   var popupFeatures = cardAd.querySelector('.popup__features');
//   if (card.offer.features) {
//     popupFeatures.innerHTML = '';
//     popupFeatures.appendChild(createFeatureFragment(card));
//   } else {
//     popupFeatures.remove();
//   }

//   // выводим описание объекта недвижимости в .popup__description
//   var popupDescription = cardAd.querySelector('.popup__description');
//   if (card.offer.description) {
//     popupDescription.textContent = card.offer.description;
//   } else {
//     popupDescription.remove();
//   }

//   // выводим фотографии в .popup__photos
//   var popupPhotos = cardAd.querySelector('.popup__photos');
//   if (card.offer.photos) {
//     popupPhotos.removeChild(cardAd.querySelector('.popup__photo'));
//     popupPhotos.appendChild(createPhotosFragment(card));
//   } else {
//     popupPhotos.remove();
//   }

//   return cardAd;
// };

// var renderCard = createCard(advt[0]);

// if (renderCard) {
//   map.insertBefore(renderCard, mapFiltersContainer);
// }
