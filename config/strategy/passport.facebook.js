var express = require('express');
var router = express.Router();
var pool = require('../../config/connection');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file

        clientID: '596599027210110',
        clientSecret: '6f4264a1b8908ca7e43dc9ca6878d192',
        callbackURL: '/auth/facebook/callback',
        profileFields: ['displayName', 'emails']
    },
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {

            pool.getConnection(function(err, connection) {
                connection.query('select * FROM users WHERE email= ?', [profile.emails[0].value], function (err, user) {

                    if (err)
                        return user(err);

                    if (user.length) {
                        return done(null, user);
                    } else {
                        // if there is no user found with that facebook id, create them
                        var user = {
                            email:          profile.emails[0].value,
                            displayName:    profile.displayName,
                            facebook_id:    profile.id
                        };

                        // save our user to the database
                        pool.getConnection(function (err, connection) {

                            connection.query('INSERT INTO users SET ?', user, function (err) {
                                console.log(user);
                                if (err) throw err;
                                return done(null);
                            });
                            connection.release();
                        });
                    }
                });
                connection.release();
            });
        });
    }
));

module.exports = router;
