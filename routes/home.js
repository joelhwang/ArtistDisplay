const express = require('express')
const router = express.Router();
const tryAsync = require('../helpers/tryAsync');
const home = require('../controllers/home');

router.get('/', tryAsync(home.getSearch));
 
router.get('/artists', tryAsync(home.getAllArtists));

router.get('/artists/:firstLetter', tryAsync(home.getFiltered));

module.exports = router;