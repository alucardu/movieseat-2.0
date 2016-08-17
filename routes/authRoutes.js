var express = require('express');
var router = express.Router();
var pool = require('../config/connection');
var passport = require('passport');

router.post('/', function(req, res, next){

    var auth = passport.authenticate('local', function(err, user){
        if(err){return next(err);}
        if(!user){
            console.log('no user')
            res.send({succes:false})
        } else {
            console.log('user')
            req.logIn(user, function(err){
                if(err) {return next(err);}
                res.send({success:true, user:user});
            })
        }
    });

    auth(req, res, next);

});

// router.post('/signUp', function(req,res){
//     var user = req.body;
//
//     pool.getConnection(function(err, connection) {
//         var data = {
//             username : user.userName,
//             password : user.password
//         };
//
//         console.log(data);
//
//         connection.query('INSERT INTO users SET ?', data, function (err) {
//             if (err) throw err;
//         });
//         connection.release();
//     });
//
//     req.login(req.body, function(){
//         res.redirect('/auth/profile')
//     });
// });
//
// router.get('/profile', function(req, res, next){
//
//     if(!req.user){
//         console.log('nope')
//         res.redirect('/')
//     }
//     res.json(req.user);
//
// });

module.exports = router;
