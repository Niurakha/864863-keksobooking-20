'use strict';

(function () {

  var DEBOUNCE_TIME = 500;
  var TABINDEX = '1';

  var lastTimeout = null;
  var cardTemplate = document.querySelector('#card').content.querySelector('article');
  var popupPhoto = cardTemplate.querySelector('.popup__photo');

  var changeAccessibility = function (controls, state) {
    controls.forEach(function (control) {
      control.disabled = state;
    });
  };

  var isEscKey = function (evt) {
    return evt.key === window.data.KEYSCODE.escape;
  };

  var isEnterKey = function (evt) {
    return evt.key === window.data.KEYSCODE.enter;
  };

  var addClickListener = function (popup, className) {
    var onPopupClick = function (evt) {
      if ((evt.target.classList.contains(className + '__message'))) {
        return;
      }

      popup.remove();
      document.removeEventListener('click', onPopupClick);
    };

    document.addEventListener('click', onPopupClick);
  };

  var addEscListener = function (popup) {
    var onPopupEscPress = function (evt) {
      popup.tabindex = TABINDEX;
      popup.focus();

      if (isEscKey(evt.key)) {
        popup.remove();
        document.removeEventListener('keydown', onPopupEscPress);
      }
    };

    document.addEventListener('keydown', onPopupEscPress);
  };

  var debounce = function (onTimeout) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(function () {
      onTimeout();
    }, DEBOUNCE_TIME);
  };

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
      popupPhotoItem.width = window.data.cardPhoto.IMG_WIDTH;
      popupPhotoItem.height = window.data.cardPhoto.HEIGHT;
      popupPhotoItem.alt = window.data.cardPhoto.IMG_ALT;
      photosFragment.appendChild(popupPhotoItem);
    }
    return photosFragment;
  };

  window.utils = {
    changeAccessibility: changeAccessibility,
    debounce: debounce,
    isEnterKey: isEnterKey,
    addClickListener: addClickListener,
    addEscListener: addEscListener,
    createFeatureFragment: createFeatureFragment,
    createPhotosFragment: createPhotosFragment
  };
})();
