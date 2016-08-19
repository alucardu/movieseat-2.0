var express = require('express');
var router = express.Router();
var pool = require('../config/connection');

router.post('/', function(req,res){
    var movie = req.body;

    if(movie.overview == ''){
        movie.overview = 'No summary available'
    }

    getAllMovies = function(){
        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM `movies`', function (error, result) {
                for (var i = result.length - 1; i >= 0; i--) {

                    if(movie.id === result[i].movie_id){
                        var movieX = movie;
                    }
                }

                if(movieX){
                    pool.getConnection(function(err, connection) {

                        var join = {
                            userid: req.user.id,
                            movie_id: movieX.id
                        };

                        connection.query('INSERT INTO user_movieid SET ?', join, function (err) {
                            if (err) throw err;
                        });

                        connection.release();
                    });
                    res.status(204).end();
                } else {
                    pool.getConnection(function(err, connection) {
                        var data = {
                            title           : movie.title,
                            release_date    : movie.release_date,
                            poster_path     : movie.poster_path,
                            overview        : movie.overview,
                            backdrop_path   : movie.backdrop_path,
                            movie_id        : movie.id
                        };

                        var join = {
                            userid: req.user.id,
                            movie_id: movie.id
                        };

                        connection.query('INSERT INTO movies SET ?', data, function (err) {
                            if (err) throw err;
                        });

                        connection.query('INSERT INTO user_movieid SET ?', join, function (err) {
                            if (err) throw err;
                        });

                        connection.release();
                    });
                    res.status(204).end();
                }


            });
            connection.release();
        });
    };

    getAllMovies();

});

router.delete('/', function(req,res){

    pool.getConnection(function(err, connection){

        connection.query('DELETE FROM user_movieid WHERE movie_id= ? AND userid = ?', [req.body.movie_id], [req.user.id], function(err, result) {
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


    if(req.user){

        pool.getConnection(function(err, connection) {

           var userid = req.user.id;

           connection.query('select * from user_movieid join movies on user_movieid.movie_id = movies.movie_id WHERE userid= ?', userid, function (err, result) {
               res.send(result);
           });
           connection.release();

       });
    } else {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM `movies`', function (error, result) {
                res.send(result);
            });
            connection.release();
        });
    }
});

module.exports = router;
