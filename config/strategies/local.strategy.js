var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    pool = require('../connection');

module.exports = function(){
    
    // passport.use(new LocalStrategy(
    //     function(username, password, done){
    //
    //         pool.getConnection(function(err, connection) {
    //             var data = {
    //                 username : user.username,
    //                 password : user.password
    //             };
    //
    //             connection.query('SELECT * FROM users WHERE username LIKE ?', [data.username], function (err, user) {
    //                 if (err) throw err;
    //
    //                 for (var i = user.length - 1; i >= 0; i--) {
    //                     var current = user[i];
    //                 }
    //
    //                 if(user){
    //                     return done(null, user);
    //                 } else {
    //                     return done(null, false);
    //                 }
    //             });
    //
    //             connection.release();
    //         });
    //     }
    // ));
    //
    // passport.serializeUser(function(user, done){
    //     console.log(user);
    //     console.log('something')
    //     if(user){
    //         done(null, user.id);
    //     }
    // });
    //
    // passport.deserializeUser(function(id, done){
    //     pool.getConnection(function(err, connection) {
    //         var data = {
    //             username : user.username,
    //             password : user.password
    //         };
    //
    //         connection.query('SELECT * FROM users WHERE id LIKE ?', [data.id], function (err, user) {
    //             if (err) throw err;
    //
    //             if(user){
    //                 return done(null, user);
    //             } else {
    //                 return done(null, false);
    //             }
    //         });
    //
    //         connection.release();
    //     });
    // });

};