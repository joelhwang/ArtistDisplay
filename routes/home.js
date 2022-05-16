const express = require('express')
const router = express.Router();
const tryAsync = require('../helpers/tryAsync');
const home = require('../controllers/home');

//home page
router.get('/', tryAsync(home.getSearch));
 
//all artists page
router.get('/artists', tryAsync(home.getAllArtists));

//content changes depending on filter settings, sort by first letter of username
router.get('/artists/:firstLetter', tryAsync(home.getFiltered));

module.exports = router;