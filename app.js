var passport = require('passport'),
    pool = require('./config/connection'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

var express = require('express');

var favicon = require('serve-favicon');

var index = require('./routes/index');
var movies = require('./routes/movies');
var authRouter = require('./routes/authRoutes');

var env = process.env.NODE_EVN = process.env.NODE_EVN || 'development';
var app = express();

var config = require('./config/config')[env];
require('./config/express.js')(app, config);

app.use(favicon(__dirname + '/public/favicon.ico'));

passport.use(new LocalStrategy(
    function(username, password, done) {

        console.log('app.js');

        pool.getConnection(function(err, connection) {

            connection.query('SELECT * FROM users WHERE username LIKE ?', [username], function (err, user) {
                if (err) throw err;

                for (var i = user.length - 1; i >= 0; i--) {
                    var current = user[i];
                }

                if(current){
                    if(bcrypt.compareSync(password, current.password)){
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                } else {
                    console.log('no user');
                    return done(null, false);
                }
            });

            connection.release();
        });
    }
));


passport.serializeUser(function(user, done){

    for (var i = user.length - 1; i >= 0; i--) {
        var current = user[i];
    }
    if(current){
        done(null, current.id);
    }
});

passport.deserializeUser(function(id, done){

    if(id){

        pool.getConnection(function(err, connection) {

            connection.query('SELECT * FROM users WHERE id LIKE ?', [id], function (err, user) {
                if (err) throw err;

                for (var i = user.length - 1; i >= 0; i--) {
                    var current = user[i];
                }

                if(current){
                    return done(null, current);
                } else {
                    return done(null, false);
                }
            });

            connection.release();
        });
    }
});

require('./config/strategies/facebook.strategy');

require('./config/routes.js')(app);

app.use('/', index);
app.use('/movies', movies);
app.use('/auth', authRouter);

module.exports = app;
