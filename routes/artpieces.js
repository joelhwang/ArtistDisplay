const express = require('express')
const router = express.Router();
const tryAsync = require('../helpers/tryAsync');
const artpieces = require('../controllers/artpieces');
const {isLoggedIn, validateArt, isCreator} = require('../middleware');
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage});

//art post request
router.route('/')
    .post(isLoggedIn, upload.single('image'), validateArt, tryAsync(artpieces.uploadArtpiece));

//form for uploading new art
router.get('/new', isLoggedIn, artpieces.renderNewForm);

//show page, edit request, and delete request
router.route('/:id')
    .get(tryAsync(artpieces.showArtpiece))
    .put(isLoggedIn, isCreator, validateArt, tryAsync(artpieces.editArtpiece))
    .delete(isCreator, tryAsync(artpieces.deleteArtpiece));

//edit form
router.get('/:id/edit', isLoggedIn, isCreator, tryAsync(artpieces.renderEditForm));

module.exports = router;