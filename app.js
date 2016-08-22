var passport = require('passport');

var express = require('express');
var app = express();

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

var env = process.env.NODE_EVN = process.env.NODE_EVN || 'development';

var config = require('./config/config')[env];
require('./config/express.js')(app, config);

// All the Express routes.
require('./config/routes.js')(app);

module.exports = app;
