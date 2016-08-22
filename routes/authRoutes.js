var express = require('express');
var router = express.Router();
var pool = require('../config/connection');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    bcrypt = require('bcrypt-nodejs');

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback',
    passport.authenticate('facebook', {successRedirect: '/',failureRedirect: '/'}),
    function(req, res){
        console.log(req);
    });

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

// passport.use(new FacebookStrategy({
//     clientID: '596599027210110',
//     clientSecret: '6f4264a1b8908ca7e43dc9ca6878d192',
//     callbackURL: 'http://localhost:3000/auth/facebook/callback',
//     profileFields: ['displayName', 'emails']
// }, function(token, refreshToken, profile, done){
//     process.nextTick(function() {
//
//         var user = {};
//
//         user.email = profile.emails[0].value;
//         user.displayName = profile.displayName;
//
//         user.facebook = {};
//         user.facebook.id = profile.id;
//
//         // done(null, user);
//     });
// }));


router.post('/login', function(req, res, next){

    var auth = passport.authenticate('local', function(err, user){
        if(err){return next(err);}
        if(!user){
            res.send({success:false})
        } else {
            req.logIn(user, function(err){
                if(err) {return next(err);}
                res.send({success:true, user:user});
            })
        }
    });

    auth(req, res, next);

});

router.post('/logout', function(req, res){
    req.logout();
    res.end();
});

router.post('/register', passport.authenticate('local-register', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

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

module.exports = router;
