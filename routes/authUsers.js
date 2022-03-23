const express = require('express');
const router = express.Router();
const tryAsync = require('../helpers/tryAsync');
const passport = require('passport');
const authUser = require('../controllers/authUsers');

router.route('/register')
    .get(authUser.renderRegisterForm)
    .post(tryAsync(authUser.registerUser));
    
router.route('/login')
    .get(authUser.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'login'}), authUser.loginUser);

router.get('/logout', authUser.logoutUser)

router.get('/artists', tryAsync(authUser.showIndex))

router.get('/:id', tryAsync(authUser.showUser))

module.exports = router;