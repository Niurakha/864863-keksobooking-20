'use strict';

(function () {
  var RESPONSE_TYPE = 'json';
  var TIMEOUT = 10000;

  var serverURL = {

    GET: 'https://javascript.pages.academy/keksobooking/data',
    POST: 'https://javascript.pages.academy/keksobooking'
  };

  var statusCode = {
    OK: 200
  };

  var createXHR = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === statusCode.OK) {
        onSuccess(xhr.response);
        return;
      }

      onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  var load = function (onSuccess, onError) {
    var xhr = createXHR(onSuccess, onError);

    xhr.open('GET', serverURL.GET);
    xhr.send();
  };

  var upload = function (data, onSuccess, onError) {
    var xhr = createXHR(onSuccess, onError);

    xhr.open('POST', serverURL.POST);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();
