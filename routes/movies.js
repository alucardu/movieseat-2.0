var express = require('express');
var router = express.Router();
var pool = require('../connection');

router.post('/', function(req,res){

    var movie = req.body;

    pool.getConnection(function(err, connection) {

        var data = {
            title : movie.title,
            release_date : movie.release_date,
            poster_path: movie.poster_path,
            overview : movie.overview
        };

        connection.query('INSERT INTO movies SET ?', data, function (err) {
            if (err) throw err;
            console.log(req.body);
        });

        connection.release();

    });

    res.status(204).end();
});

module.exports = router;
