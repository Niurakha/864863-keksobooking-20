'use strict';

(function () {

  // генерируем случайное число

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // генерируем случайный элемент массива

  var getRandomElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  window.utils = {
    getRandomInt: getRandomInt,
    getRandomElement: getRandomElement
  };

})();
