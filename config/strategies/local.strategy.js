var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    pool = require('../../connection');


module.exports = function(){
  passport.use(new LocalStrategy({
      usernameField: 'userName',
      passwordField: 'password'
  }, function(username, password, done){

    pool.getConnection(function(err, connection) {
        var data = {
            username : user.username,
            password : user.password
        };

        connection.query('SELECT * FROM users WHERE username LIKE ?', [data.username], function (err, results) {
            if (err) throw err;

            for (var i = results.length - 1; i >= 0; i--) {
                var current = results[i];
            }

            if(current.password === password){
                var user = current;
                done(null, user);
            } else {
                done(null, false,{
                    message: 'Bad password'
                })
            }
        });

        connection.release();
    });

    var user = {
      username: username,
      password: password
    };

    // done(null, user);
  }));

};