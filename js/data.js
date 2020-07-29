'use strict';

(function () {

  var HALF_SIZE_DIVIDER = 2;

  var mapSize = {
    MIN_X: 0,
    MAX_X: 1200,
    MIN_Y: 130,
    MAX_Y: 630
  };
  var KEYSCODE = {
    leftMouseButton: 1,
    enter: 13,
    escape: 27
  };

  var cardPhoto = {
    WIDTH: 45,
    HEIGHT: 40,
    IMG_ALT: 'Фотография жилья'
  };

  var avatarPhotoSize = {
    WIDTH: 70,
    HEIGHT: 70
  };
  window.data = {
    mapSize: mapSize,
    KEYSCODE: KEYSCODE,
    HALF_SIZE_DIVIDER: HALF_SIZE_DIVIDER,
    cardPhoto: cardPhoto,
    avatarPhotoSize: avatarPhotoSize
  };
})();
