var express = require('express'),
    passport = require('passport'),
    pool = require('./config/connection'),
    LocalStrategy = require('passport-local').Strategy;

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

        pool.getConnection(function(err, connection) {
            var data = {
                username : username,
                password : password
            };

            connection.query('SELECT * FROM users WHERE username LIKE ?', [data.username], function (err, user) {
                if (err) throw err;

                for (var i = user.length - 1; i >= 0; i--) {
                    var current = user[i];
                }

                if(current){
                    return done(null, user);
                } else {
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
});

require('./config/routes.js')(app);


app.use('/', index);
app.use('/movies', movies);
app.use('/login', authRouter);

module.exports = app;
