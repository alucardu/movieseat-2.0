var express = require('express');
var router = express.Router();
var pool = require('../connection');
var passport = require('passport');

router.post('/signIn',
    passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/'
    })
);

router.post('/signUp', function(req,res){
    var user = req.body;

    pool.getConnection(function(err, connection) {
        var data = {
            username : user.userName,
            password : user.password
        };

        console.log(data);

        connection.query('INSERT INTO users SET ?', data, function (err) {
            if (err) throw err;
        });
        connection.release();
    });

    req.login(req.body, function(){
        res.redirect('/auth/profile')
    });
});

router.get('/profile', function(req, res, next){

    if(!req.user){
        console.log('nope')
        res.redirect('/')
    }
    res.json(req.user);

});

module.exports = router;
