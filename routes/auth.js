var express = require('express');
var router = express.Router();
var passportController = require('../controllers/passport')

router.get('/', function(req, res) {
    res.render('auth/index'); // load the index file
  });

router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('auth/login', { title: 'Login', message: req.flash('loginMessage') }); 
  })
  .post('/login', passportController.localAuth);


router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('auth/signup', { title: 'Signup', message: req.flash('signupMessage') });
  })
  .post('/signup', passportController.localCreate);

router.get('/profile', passportController.isLoggedIn, function(req, res) {
  res.render('auth/profile', {
        title: 'Profile page', user : req.user // get the user out of session and pass to template
      });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;