var passport = require('passport');

module.exports = function() {
    require('./strategies/local.strategy')();

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
