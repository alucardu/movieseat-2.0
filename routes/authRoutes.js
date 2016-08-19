var express = require('express');
var router = express.Router();
var pool = require('../config/connection');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');

router.post('/login', function(req, res, next){

    var auth = passport.authenticate('local', function(err, user){
        if(err){return next(err);}
        if(!user){
            res.send({succes:false})
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

                // console.log('authRoutes');
                // console.log(password);
                password = bcrypt.hashSync(password);
                // console.log(password);

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

module.exports = router;
