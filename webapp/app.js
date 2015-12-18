
/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');
var passport = require('passport');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var connectAssets = require('connect-assets');
var multer = require('multer')
var path = require('path')

var app = express();
var http = require('http');
var server = http.createServer(app);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./config/routes')(app, passport);

server.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;

