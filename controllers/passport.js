var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
// models and configures
var configAuth       = require('./auth');
var User             = require('../models/user');

module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

  // LOCAL SIGNUP ============================================================
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField     : 'email',
      passwordField     : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;

            return done(null, newUser);
          });
        }
      });    
    });
  }));

  // LOCAL LOGIN =============================================================
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField     : 'email',
    passwordField     : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);

        // if no user is found, return the message
        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
    });

  }));


  // FACEBOOK ================================================================
  passport.use('facebook', new FacebookStrategy({
      // pull in our app id and secret from our auth.js file
      clientID     : configAuth.facebookAuth.clientID,
      clientSecret : configAuth.facebookAuth.clientSecret,
      callbackURL  : configAuth.facebookAuth.callbackURL,
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {
          // find the user in the database based on their facebook id
          User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
              return done(err);

            // if the user is found, then log them in
            if (user) {
              // if there is a user id already but no token (user was linked at one point and then removed)
              // just add our token and profile information
              if (!user.facebook.token) {
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails)? profile.emails[0].value : 'pox255@gmail'; // facebook can return multiple emails

                user.save(function(err) {
                  if (err)
                    throw err;
                  
                  return done(null, user);
                });
              }

              return done(null, user); // user found, return that user
              
            } else {
              // if there is no user found with that facebook id, create them
              var newUser            = new User();

              // set all of the facebook information in our user model
              newUser.facebook.id    = profile.id; // set the users facebook id                   
              newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
              newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
              newUser.facebook.email = (profile.emails)? profile.emails[0].value : 'pox255@gmail'; // facebook can return multiple emails so we'll take the first

              // save our user to the database
              newUser.save(function(err) {
                if (err)
                  throw err;

                // if successful, return the new user
                return done(null, newUser);
              });
            // user already exists and is logged in, we have to link accounts
            }
          });

        } else {

          var user            = req.user; // pull the user out of the session

          // update the current users facebook credentials
          user.facebook.id    = profile.id;
          user.facebook.token = token;
          user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email = (profile.emails)? profile.emails[0].value : 'pox255@gmail'; // facebook can return multiple emails so we'll take the first

          // save the user
          user.save(function(err) {
            if (err)
              throw err;

            return done(null, user);
          });
        }

      });
    }
  ));


  // TWITTER =================================================================
  passport.use('twitter', new TwitterStrategy({
      consumerKey     : configAuth.twitterAuth.consumerKey,
      consumerSecret  : configAuth.twitterAuth.consumerSecret,
      callbackURL     : configAuth.twitterAuth.callbackURL,
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, tokenSecret, profile, done) {

      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Twitter
      process.nextTick(function() {

        // check if the user is already logged in
        if (!req.user) {

        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);

          // if the user is found then log them in
          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            // just add our token and profile information
            if (!user.twitter.token) {
              user.twitter.token = token;
              user.twitter.username    = profile.username;
              user.twitter.displayName = profile.displayName;

              user.save(function(err) {
                if (err)
                  throw err;

                return done(null, user);
              });
            }

            return done(null, user); // user found, return that user

          } else {
            // if there is no user, create them
            var newUser                 = new User();

            // set all of the user data that we need
            newUser.twitter.id          = profile.id;
            newUser.twitter.token       = token;
            newUser.twitter.username    = profile.username;
            newUser.twitter.displayName = profile.displayName;

            // save our user into the database
            newUser.save(function(err) {
              if (err)
                throw err;

              return done(null, newUser);
            });
          }
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user            = req.user; // pull the user out of the session

        // update the current users twitter credentials
        user.twitter.id    = profile.id;
        user.twitter.token = token;
        user.twitter.username  = profile.username;
        user.twitter.displayName = profile.displayName;

        // save the user
        user.save(function(err) {
          if (err)
            throw err;

          return done(null, user);
        });
      }

    });
  }));

  // GOOGLE ==================================================================
  passport.use('google', new GoogleStrategy({

      clientID        : configAuth.googleAuth.clientID,
      clientSecret    : configAuth.googleAuth.clientSecret,
      callbackURL     : configAuth.googleAuth.callbackURL,
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

  },
  function(req, token, refreshToken, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {

      // check if the user is already logged in
      if (!req.user) {

        // try to find the user based on their google id
        User.findOne({ 'google.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);

          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            // just add our token and profile information
            if (!user.google.token) {
              user.google.token = token;
              user.google.username    = profile.username;
              user.google.displayName = profile.displayName;

              user.save(function(err) {
                if (err)
                  throw err;

                return done(null, user);
              });
            }

            // if a user is found, log them in
            return done(null, user);

          } else {
            // if the user isnt in our database, create a new user
            var newUser          = new User();

            // set all of the relevant information
            newUser.google.id    = profile.id;
            newUser.google.token = token;
            newUser.google.name  = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email

            // save the user
            newUser.save(function(err) {
              if (err)
                throw err;

              return done(null, newUser);
            });
          }
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user            = req.user; // pull the user out of the session

        // update the current users google credentials
        user.google.id    = profile.id;
        user.google.token = token;
        user.google.name  = profile.displayName;
        user.google.email = profile.emails[0].value;

        // save the user
        user.save(function(err) {
          if (err)
            throw err;

          return done(null, user);
        });
      }

    });
  }));

};
