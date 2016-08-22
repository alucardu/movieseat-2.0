var express = require('express');
var router = express.Router();
var pool = require('../../config/connection');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

passport.use('local-register', new LocalStrategy(
    {},
    function(username, password, done) {
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        pool.getConnection(function(err, connection){
            connection.query('select * FROM users WHERE username= ?', [username], function(err, data) {

                if (err)
                    return data(err);
                if (data.length) {
                    return data(null, false);
                } else {

                    password = bcrypt.hashSync(password);

                    var data = {
                        username : username,
                        password : password
                    };

                    pool.getConnection(function(err, connection) {

                        connection.query('INSERT INTO users SET ?', data, function (err) {
                            if (err) throw err;
                            return done(null);
                        });
                        connection.release();
                    });
                }
            });
        });
    }
));

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

module.exports = router;

