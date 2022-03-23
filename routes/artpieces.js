const express = require('express')
const router = express.Router();
const tryAsync = require('../helpers/tryAsync');
const artpieces = require('../controllers/artpieces');
const {isLoggedIn, validateArt, isCreator} = require('../middleware');
const res = require('express/lib/response');
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage});

router.route('/')
    .get(tryAsync(artpieces.index))
    .post(isLoggedIn, upload.single('image'), validateArt, tryAsync(artpieces.uploadArtpiece));

router.get('/new', isLoggedIn, artpieces.renderNewForm);

router.route('/:id')
    .get(tryAsync(artpieces.showArtpiece))
    .put(isLoggedIn, isCreator, validateArt, tryAsync(artpieces.editArtpiece))
    .delete(isCreator, tryAsync(artpieces.deleteArtpiece));

router.get('/:id/edit', isLoggedIn, isCreator, tryAsync(artpieces.renderEditForm));

module.exports = router;