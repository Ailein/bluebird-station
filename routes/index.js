var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Home Page
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/currentUser', function(req, res, next) {
	res.json(currentUser);
});

// Signup Page
router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
	res.json(req.user);
});

// Login Page
router.post('/login', passport.authenticate('local-login'), function(req, res) {
	res.json(req.user);
});

// Logout
router.get('/logout', function(req, res, next) {
	req.logout();
	res.json({ msg: 'Logged Out' });
});

module.exports = router;