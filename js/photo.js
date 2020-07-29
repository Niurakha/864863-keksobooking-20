'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreviewBlock = document.querySelector('.ad-form-header__preview img');
  var accommodationPhotoChooser = document.querySelector('#images');
  var accommodationPhotoPreviewBlock = document.querySelector('.ad-form__photo');

  var avatarPreviewDefaultSrc = avatarPreviewBlock.src;

  var createImgElement = function () {
    var photoItem = document.createElement('img');
    photoItem.width = window.data.avatarPhotoSize.WIDTH;
    photoItem.height = window.data.avatarPhotoSize.HEIGHT;
    return photoItem;
  };

  var loadFile = function (fileChooser, filePreview, cb) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (!matches) {
      return;
    }

    var reader = new FileReader();
    reader.addEventListener('load', function () {
      if (cb) {
        filePreview = cb();
        accommodationPhotoPreviewBlock.appendChild(filePreview);
      }

      filePreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var resetPhotoInputs = function () {
    avatarPreviewBlock.src = avatarPreviewDefaultSrc;
    accommodationPhotoPreviewBlock.innerHTML = '';
  };

  var onAvatarUpload = function () {
    loadFile(avatarChooser, avatarPreviewBlock);
  };

  var onPhotoUpload = function () {
    loadFile(accommodationPhotoChooser, accommodationPhotoChooser, createImgElement);
  };

  window.photo = {
    onAvatarUpload: onAvatarUpload,
    onUpload: onPhotoUpload,
    resetInputs: resetPhotoInputs,
    avatarChooser: avatarChooser,
    accomodationPicChooser: accommodationPhotoChooser,
  };
})();
