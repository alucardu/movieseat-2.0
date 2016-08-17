var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    stylus = require('stylus'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport');

module.exports = function(app, config){

    app.set('views', config.rootPath + '/views');
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({secret: 'movie unicorns', resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(stylus.middleware(
        {
            src: config.rootPath + '/public'
        }
    ));

    app.use(express.static(config.rootPath + '/public'));
    app.use('/bower_components', express.static(config.rootPath + '/bower_components'));

};