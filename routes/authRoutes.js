var express = require('express');
var router = express.Router();
var pool = require('../config/connection');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

router.post('/login', function(req, res, next){

    console.log('login');

    var auth = passport.authenticate('local', function(err, user){
        if(err){return next(err);}
        if(!user){
            res.send({succes:false})
        } else {
            console.log('user');
            req.logIn(user, function(err){
                if(err) {return next(err);}
                res.send({success:true, user:user});
            })
        }
    });

    auth(req, res, next);

});

// router.post('/register', function(req){
//     console.log("body parsing", req.body);
// });

router.post('/register', passport.authenticate('local-register', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/' // redirect back to the signup page if there is an error
    // failureFlash : true // allow flash messages
}));

passport.use('local-register', new LocalStrategy(
    {},
    function(username, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        pool.getConnection(function(err, connection){
            connection.query('select * FROM users WHERE username= ?', [username], function(err, rows) {

            console.log(rows);
            console.log("above row object");
            if (err)
                return done(err);
            if (rows.length) {
                console.log('exists')
                return done(null, false);
            } else {

                pool.getConnection(function(err, connection) {
                    var data = {
                        username : username,
                        password : password
                    };

                    console.log(data);

                    connection.query('INSERT INTO users SET ?', data, function (err, user) {
                        if (err) throw err;
                        return done(null, user);
                    });
                    connection.release();
                });

            }
            });
        });
    }
));

module.exports = router;
