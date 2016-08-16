angular.module('movieSeat')
    .controller('getmovieController', ['$rootScope', 'getmovieFactory', '$scope', '$filter', '$q', '$timeout', function ($rootScope, getmovieFactory, $scope, $filter, $q, $timeout) {

        $scope.moviesX = [];

        $scope.removeMovie = function(movie){
            $scope.model.rowIndex = null;
            $scope.transition = 'fadeOut';
            $rootScope.$broadcast('onRemoveMovieEvent', movie);
            $timeout(function () {
                $scope.overview = false;
                $scope.movieDetail = {};
                $scope.movieDetail.backdrop_path = '/yqyZLEfSiSeqmn5oRahbOUTUHd9.jpg'
                $scope.transition = '';
            }, 300);
        };

        getmovieFactoryFN = function(){
            getmovieFactory.getMovies().then(function(response){

                $scope.moviesX = response;
                $scope.moviesPreload = response;
                $scope.loadingWatchlist = false;

                function preLoad() {
                    var promises = [];

                    function loadImage(src) {
                        return $q(function (resolve) {
                            var image = new Image();
                            image.src = src;
                            image.onload = function () {
                                resolve(image);
                            }
                        });
                    }

                    $scope.moviesPreload.forEach(function (image) {
                        promises.push(loadImage('http://image.tmdb.org/t/p/w500' + image.poster_path));
                    });

                    return $q.all(promises).then(function () {
                        $scope.movies = $scope.moviesPreload;

                        var orderBy = $filter('orderBy');
                        var orderedWatchlist = orderBy($scope.movies, "release_date", true);

                        var i, j, temparray, chunk = 8;
                        $scope.movieGroups = [];
                        for (i=0,j=orderedWatchlist.length; i<j; i+=chunk) {
                            temparray = orderedWatchlist.slice(i,i+chunk);
                            $scope.movieGroups.push(temparray);
                        }

                        $scope.loadingWatchlist = true;
                    });

                }

                preLoad();

            });
        };

        getmovieFactoryFN();

        $scope.$on('onAddMovieEvent', function (event, movie) {

            $scope.moviesX.push(movie);
            $scope.movieGroups = [];

            var orderBy = $filter('orderBy');
            var orderedWatchlist = orderBy($scope.moviesX, "release_date", true);

            var i, j, temparray, chunk = 8;
            for (i=0,j=orderedWatchlist.length; i<j; i+=chunk) {
                temparray = orderedWatchlist.slice(i,i+chunk);
                $scope.movieGroups.push(temparray);
            }
        });

        $scope.$on('onRemoveMovieEventUpdate', function (event, movie) {
            console.log('onRemoveMovieEventUpdate!!');
            var index = $scope.moviesX.indexOf(movie);
            $scope.moviesX.splice(index, 1);

            $scope.movieGroups = [];

            var orderBy = $filter('orderBy');
            var orderedWatchlist = orderBy($scope.moviesX, "release_date", true);

            var i, j, temparray, chunk = 8;
            for (i=0,j=orderedWatchlist.length; i<j; i+=chunk) {
                temparray = orderedWatchlist.slice(i,i+chunk);
                $scope.movieGroups.push(temparray);
            }
        });

        $scope.model = {};

        $scope.toggleRow = function(parentindex, movie) {

            if($scope.movieDetail == movie){
                $scope.model.rowIndex = null;
                $scope.transition = 'fadeOut';
                $timeout(function () {
                    $scope.overview = false;
                    $scope.movieDetail = {};
                    $scope.movieDetail.backdrop_path = movie.backdrop_path;
                    $scope.transition = '';
                }, 300);
                return
            }

            if (parentindex !== $scope.model.rowIndex) {
                $scope.model.rowIndex = parentindex;
            }

            var result = document.getElementById("movie_details_container");

            if (angular.element(result).hasClass('fadeIn')) {
                $scope.overview = true;
                $scope.transition = 'fadeOut';
                $timeout(function () {
                    $scope.movieDetail = movie;
                    $scope.transition = 'fadeIn';
                }, 300);
            } else {
                $scope.transition = 'fadeIn';
                $scope.overview = true;
                $scope.movieDetail = movie;
            }
        };

        $scope.close = function(){
            $scope.model.rowIndex = null;
            $scope.transition = 'fadeOut';
            $timeout(function () {
                $scope.overview = false;
                $scope.movieDetail = {};
                $scope.movieDetail.backdrop_path = '/yqyZLEfSiSeqmn5oRahbOUTUHd9.jpg'
                $scope.transition = '';
            }, 300);
        };


    }]);