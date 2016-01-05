var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var flash    = require('connect-flash');
var imagePlaceholder = require('img-placeholder');
var morgan = require('morgan');//logger
var mongoose = require('mongoose');
var nib = require('nib');
var passport = require('passport');
var path = require('path');
var session = require('express-session');
var stylus = require('stylus');

//conect to the base
mongoose.connect('mongodb://localhost:27017/local');

var api = require('./routes/api');
var auth = require('./routes/auth');
var routes = require('./routes/index');

var app = express();

// view engine setup
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
    .set('compress', true);
    //.import('nib');
}

app.use( stylus.middleware({
  src: __dirname + '/public/css',
  dest: __dirname + '/public/css',
  compile: compile,
  debug: true,
  force: true
}) );

//http://localost/genimg/100x400.png
app.use( imagePlaceholder({
  maxWidth : 10000,
  maxHeight : 10000,
  backgroundStyle : '#AFD7FF',
  textStyle : '#FFF',
  fontSizeParam : 6
}) );

// Use the passport package in our application
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//app.use( express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use( favicon(path.join(__dirname, 'public/img', 'favicon.ico')) );
app.use( morgan('dev') );
app.use( bodyParser.json() );// get information from html forms
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( cookieParser() );// read cookies (needed for auth)
app.use( express.static(path.join(__dirname, 'public')) );
app.use( express.static(path.join(__dirname, 'bower_components')) );

app.use( '/api', api );
app.use( '/auth', auth );
app.use( '/', routes );

// catch 404 and forward to error handler

app.use( function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
} );

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use( function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
      
    });
  } ).locals.pretty = true;
}

// production error handler
// no stacktraces leaked to user
app.use( function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
} );


module.exports = app;