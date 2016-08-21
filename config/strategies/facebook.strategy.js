// var passport = require('passport'),
//     FacebookStrategy = require('passport-facebook').Strategy;
//
// module.exports = function(){
//   passport.use('facebook', new FacebookStrategy({
//       clientID: '1641840062698291',
//       clientSecret: '784672233516681fc9aba625d96aa2fb',
//       callbackURL: 'http://localhost:3000/auth/facebook/callback',
//       passReqToCallback: true
//   }, function(req, accesToken, refreshToken, profile, done){
//       var user = {};
//
//       user.email          = profile.emails[0].value;
//       user.displayName    = profile.displayName;
//
//       user.facebook       = {};
//       user.facebook.id    = profile.id;
//       user.facebook.token = accesToken;
//
//       done(null, user);
//   }))
// };