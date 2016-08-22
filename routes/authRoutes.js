var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../config/strategy/passport.facebook');

router.get('/facebook',
    passport.authenticate('facebook', {
        scope: ['email']
    }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {successRedirect: '/',failureRedirect: '/'}),
    function(req, res){
        console.log(req);
    });

require('../config/strategy/passport.local');

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




module.exports = router;
