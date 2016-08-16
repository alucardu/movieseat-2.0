var express = require('express');
var router = express.Router();
var pool = require('../connection');

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
            console.log('success')
        });
        connection.release();
    });

    req.login(req.body, function(){
        res.redirect('/auth/profile')
    });
});

router.get('/profile', function(req, res){
    res.json(req.user);
});

module.exports = router;
