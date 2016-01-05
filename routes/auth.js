var express = require('express');
var router = express.Router();
var passportController = require('../controllers/passport')

//menu auth
router.get('/', function(req, res) {
    res.render('auth/index'); // load the index file
  });

//local-login
router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('auth/login', { title: 'Login', message: req.flash('loginMessage') }); 
  })
  .post('/login', passportController.localAuth);

//local-signup
router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('auth/signup', { title: 'Signup', message: req.flash('signupMessage') });
  })
  .post('/signup', passportController.localCreate);

//facebook
router.get('/facebook', passportController.facebookAuth)
  .get('/facebook/callback', passportController.facebookCallback);

//twitter
router.get('/twitter', passportController.twitterAuth)
  .get('/twitter/callback', passportController.twitterCallback);

//profile
router.get('/profile', passportController.isLoggedIn, function(req, res) {
  res.render('auth/profile', {
        title: 'Profile page', user : req.user // get the user out of session and pass to template
      });
});

//logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;