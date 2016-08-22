var passport = require('passport');
var pool = require('../config/connection');


exports.authenticate = function(req, res, next){
    var auth = passport.authenticate('local', function(err, user){
        if(err) {return next(err)}
        if(!user){ res.send({success:false})}
        req.logIn(user, function(err){
            if(err) {return next(err)}
            res.send({success: true, user:user})
        })
    });
    auth(req, res, next);
};

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