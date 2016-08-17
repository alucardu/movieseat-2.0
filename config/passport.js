// var passport = require('passport'),
//     pool = require('./connection'),
//     LocalStrategy = require('passport-local').Strategy;
//
// module.exports = function(){
//     passport.use(new LocalStrategy(
//         function(username, password, done) {
//
//             pool.getConnection(function(err, connection) {
//                 var data = {
//                     username : username,
//                     password : password
//                 };
//
//                 connection.query('SELECT * FROM users WHERE username LIKE ?', [data.username], function (err, user) {
//                     if (err) throw err;
//
//                     for (var i = user.length - 1; i >= 0; i--) {
//                         var current = user[i];
//                     }
//
//                     if(current){
//                         return done(null, user);
//                     } else {
//                         return done(null, false);
//                     }
//                 });
//
//                 connection.release();
//             });
//         }
//     ));
//
//     passport.serializeUser(function(user, done){
//
//         for (var i = user.length - 1; i >= 0; i--) {
//             var current = user[i];
//         }
//         if(current){
//             done(null, current.id);
//         }
//     });
//
//     passport.deserializeUser(function(id, done){
//
//         pool.getConnection(function(err, connection) {
//
//             connection.query('SELECT * FROM users WHERE id LIKE ?', [id], function (err, user) {
//                 if (err) throw err;
//
//                 for (var i = user.length - 1; i >= 0; i--) {
//                     var current = user[i];
//                 }
//
//                 if(current){
//                     return done(null, current);
//                 } else {
//                     return done(null, false);
//                 }
//             });
//
//             connection.release();
//         });
//     });
// };