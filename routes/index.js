var express = require('express');
var router = express.Router();
var passport = require('passport');
const models = require('../models');
var cel = require('connect-ensure-login');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

router.get('/login', function(req, res, next) {
	res.redirect('/');
});

router.get('/register', function(req, res, next) {
	res.render('index', {title : 'Register'});
})

router.post('/register', function(req, res, next) {
	//todo: no duplicate usernames
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      models.Users.create({
				username: req.body.username,
				password: hash,
				accountType: req.body.type === 'true' ? 'ADMIN' : 'CUSTOMER',
				salt: salt
			}).then(function(resp) {
				//todo send email
				console.log(resp);
				res.redirect('/');
			}).catch(function(resp) {
				res.status(500).send(resp);
			});
    });
	});

	
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/'}),
 	function(req, res, next) {
	res.redirect('/profile');
});

router.get('/profile',
  cel.ensureLoggedIn(),
  function(req, res){
  	//console.log(req);
  	//console.log(req.session.passport.user);
    res.render('index', { title: 'Profile for: ' + req.session.passport.user });
  });

router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });


module.exports = router;
