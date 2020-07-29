'use strict';

(function () {

  var DEFAULT_FILTER_VALUE = 'any';
  var PINS_MAX_AMOUNT = 5;

  var filterForm = document.querySelector('.map__filters');
  var housingType = filterForm.querySelector('#housing-type');
  var housingPrice = filterForm.querySelector('#housing-price');
  var housingRooms = filterForm.querySelector('#housing-rooms');
  var housingGuests = filterForm.querySelector('#housing-guests');

  var accommodationPrice = {
    MIDDLE: 'middle',
    LOW: 'low',
    HIGH: 'high'
  };

  var price = {
    MIDDLE: 10000,
    HIGH: 50000
  };

  var filterByAccommodationType = function (adv) {
    return adv.offer.type === housingType.value || housingType.value === DEFAULT_FILTER_VALUE;
  };

  var filterByAccommodationPrice = function (adv) {
    if (housingPrice.value === accommodationPrice.LOW) {
      return +adv.offer.price < price.MIDDLE;
    }
    if (housingPrice.value === accommodationPrice.MIDDLE) {
      return +adv.offer.price >= price.MIDDLE && +adv.offer.price < price.HIGH;
    }
    if (housingPrice.value === accommodationPrice.HIGH) {
      return +adv.offer.price >= price.HIGH;
    }

    return true;
  };

  var filterByRoomsAmount = function (adv) {
    return +housingRooms.value === adv.offer.rooms || housingRooms.value === DEFAULT_FILTER_VALUE;
  };

  var filterByGuestsAmount = function (adv) {
    return +housingGuests.value === adv.offer.guests || housingGuests.value === DEFAULT_FILTER_VALUE;
  };

  var filterByFeatures = function (adv) {
    var chosenFeatures = filterForm.querySelectorAll('input:checked');

    return Array.from(chosenFeatures).every(function (feature) {
      return adv.offer.features.includes(feature.value);
    });
  };

  var filterOffers = function (adverts) {
    var filteredAdvs = [];
    for (var i = 0; i < adverts.length; i++) {
      var advert = adverts[i];
      if (filterByAccommodationType(advert) &&
        filterByAccommodationPrice(advert) &&
        filterByRoomsAmount(advert) &&
        filterByGuestsAmount(advert) &&
        filterByFeatures(advert)
      ) {
        filteredAdvs.push(advert);
      }

      if (filteredAdvs.length === PINS_MAX_AMOUNT) {
        break;
      }
    }

    return filteredAdvs;
  };

  var updatePins = function () {
    var filteredAdvs = filterOffers(window.pins.advertisements);
    window.pins.renderPins(filteredAdvs);
  };

  var onFiltersChange = function () {
    window.pins.removePins();
    window.card.closeCard();
    window.utils.debounce(updatePins);
  };

  filterForm.addEventListener('change', onFiltersChange);
})();
