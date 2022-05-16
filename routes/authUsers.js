const express = require('express');
const router = express.Router();
const tryAsync = require('../helpers/tryAsync');
const passport = require('passport');
const authUser = require('../controllers/authUsers');

//register form and register post request
router.route('/register')
    .get(authUser.renderRegisterForm)
    .post(tryAsync(authUser.registerUser));

//login form and login post request
router.route('/login')
    .get(authUser.renderLoginForm)
    //if login failed, flash failure message and redirect to login page
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'login'}), authUser.loginUser);

//logout request
router.get('/logout', authUser.logoutUser)

//show user profile
router.get('/:id', tryAsync(authUser.showUser))

module.exports = router;