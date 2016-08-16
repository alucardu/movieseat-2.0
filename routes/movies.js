var express = require('express');
var router = express.Router();
var pool = require('../connection');

router.post('/', function(req,res){
    var movie = req.body;

    if(movie.overview == ''){
        movie.overview = 'No summary available'
    }

    pool.getConnection(function(err, connection) {
        var data = {
            title           : movie.title,
            release_date    : movie.release_date,
            poster_path     : movie.poster_path,
            overview        : movie.overview,
            backdrop_path   : movie.backdrop_path,
            movie_id        : movie.id
        };
        connection.query('INSERT INTO movies SET ?', data, function (err) {
            if (err) throw err;
        });
        connection.release();
    });
    res.status(204).end();
});

router.delete('/', function(req,res){

    console.log([req.body.movie_id]);

    pool.getConnection(function(err, connection){

        connection.query('DELETE FROM movies WHERE movie_id= ?', [req.body.movie_id], function(err, result) {
            if (err) {
                throw err;
            } else {
            }
        });
        connection.release();
    });
    res.status(204).end();
});

router.get('/', function(req, res){
   pool.getConnection(function(err, connection) {
       connection.query('SELECT * FROM `movies`', function (error, result) {
           res.send(result);
       });
       connection.release();
   });
});

module.exports = router;
