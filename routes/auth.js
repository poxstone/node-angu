var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../controllers/passport.js')(passport);

//menu auth
router.get('/', function(req, res) {
    res.render('auth/index'); // load the index file
  });

// AUTHENTICATE (FIRST LOGIN) ==================================================
//local-login
router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('auth/login', { title: 'Login', message: req.flash('loginMessage') }); 
  })
  .post('/login', passport.authenticate('local-login', {
    successRedirect : '/auth/profile', // redirect to the secure profile section
    failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
    failureFlash    : true // allow flash messages
  })
);

//local-signup
router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('auth/signup', { title: 'Signup', message: req.flash('signupMessage') });
  })
  .post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/auth/profile', // redirect to the secure profile section
    failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
    failureFlash    : true // allow flash messages
  })
);

//facebook
router.get('/facebook', passport.authenticate('facebook', { scope : 'email' }) )
  .get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/'
  })
);

//twitter
router.get('/twitter', passport.authenticate('twitter') )
  .get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/'
  })
);

//google
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }) )
  .get('/google/callback', passport.authenticate('google', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/'
  })
);

//profile
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('auth/profile', {
    title: 'Profile page', user : req.user // get the user out of session and pass to template
  })
});


// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// locally --------------------------------
router.get('/connect/local', function(req, res) {
  res.render('auth/connect-local', { message: req.flash('signupMessage') });
});
router.post('/connect/local', passport.authenticate('local-signup', {
  successRedirect : '/auth/profile', // redirect to the secure profile section
  failureRedirect : '/auth/connect/local', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

// facebook -------------------------------

// send to facebook to do the authentication
router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

// handle the callback after facebook has authorized the user
router.get('/connect/facebook/callback',
  passport.authorize('facebook', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/'
  }));

// twitter --------------------------------

// send to twitter to do the authentication
router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

// handle the callback after twitter has authorized the user
router.get('/connect/twitter/callback',
  passport.authorize('twitter', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/'
  }));


// google ---------------------------------

// send to google to do the authentication
router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

// the callback after google has authorized the user
router.get('/connect/google/callback',
  passport.authorize('google', {
    successRedirect : '/auth/profile',
    failureRedirect : '/auth/'
  }));

// UNLINK ACCOUNTS =============================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future
// local -----------------------------------
router.get('/unlink/local', function(req, res) {
  var user            = req.user;
  user.local.email    = undefined;
  user.local.password = undefined;
  user.save(function(err) {
    res.redirect('/auth/profile');
  });
});

// facebook -------------------------------
router.get('/unlink/facebook', function(req, res) {
  var user            = req.user;
  user.facebook.token = undefined;
  user.save(function(err) {
    res.redirect('/auth/profile');
  });
});

// twitter --------------------------------
router.get('/unlink/twitter', function(req, res) {
  var user           = req.user;
  user.twitter.token = undefined;
  user.save(function(err) {
    res.redirect('/auth/profile');
  });
});

// google ---------------------------------
router.get('/unlink/google', function(req, res) {
  var user          = req.user;
  user.google.token = undefined;
  user.save(function(err) {
    res.redirect('/auth/profile');
  });
});

// LOGOUT =====================================================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/auth/');
}

module.exports = router;