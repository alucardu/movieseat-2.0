app = angular.module('movieSeat', ['ngMaterial']);

angular.module('movieSeat')
    .factory('movieaddFactory', ['$http', '$q', function ($http, $q) {
        var factory = {};

        factory.addMovie = function (movie) {

            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/movies',
                data: movie
            })
                .success(function (data) {
                    console.log('success');
                })
                .catch(function () {
                    deferred.reject();
                });
            return deferred.promise;

        };

        return factory;

    }]);
/**
 * Created by alucardu on 9-8-2016.
 */

angular.module('movieSeat')
    .controller('moviesearchCtrl', ['movieaddFactory', 'moviesearchFactory', '$scope', '$q', '$timeout', '$http' , function (movieaddFactory, moviesearchFactory, $scope, $q, $timeout, $http) {

        $scope.add = function (movie)  {

            movieaddFactory.addMovie(movie).then(function(response){
                $scope.movies = response;
                console.log($scope.movies)
            });

        };

        $scope.showResult = false;
        $scope.createList = function (searchquery) {

            $scope.showResult = true;
            if ($scope.searchquery.length > 0) {
                $scope.showProgress = true;

                moviesearchFactory.getMovies(searchquery).then(function (response) {

                    $scope.moviesResponse = response;
                    if ($scope.moviesResponse.length > 0) {
                        $scope.noResult = false;
                    } else {
                        $scope.noResult = true;
                    }

                    $scope.moviesPreload = [];
                    $scope.moviesResponse.forEach(function (movie) {
                        if (movie.poster_path !== null) {

                            if (movie.overview == '' ) {
                                movie.overview = 'No summary available';
                            }

                            $scope.moviesPreload.push({
                                poster_path: 'http://image.tmdb.org/t/p/w92/' + movie.poster_path,
                                title: movie.title,
                                release_date: movie.release_date,
                                overview: movie.overview
                            })
                        }
                    });

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
                            promises.push(loadImage(image.poster_path));
                        });

                        return $q.all(promises).then(function () {
                            $scope.movies = $scope.moviesPreload;
                            $scope.showProgress = false;
                        });

                    }

                    preLoad();

                });
            } else {
                $scope.movies = [];
                $scope.noResult = false;
                $scope.model = {};
            }

        };

        // toggleInfo
        $scope.model = {};


        $scope.toggleDisplay = function (index) {

            if (index == $scope.model.displayedIndex) {
                $scope.model.displayedIndex = -1;
                $scope.toggleSsomething = false;
            } else {
                $scope.model.displayedIndex = index;
                $scope.toggleSsomething = true;
            }

            $timeout(function () {
                var h = document.getElementsByClassName('container_additional_information');
                var y = document.getElementsByClassName('additional_info ');

                for (var i = 0; i < y.length; i++) {
                    h[i].style.height = Number(y[i].clientHeight) + 'px';
                }
            }, 25);
        }

    }]);
angular.module('movieSeat')
    .factory('moviesearchFactory', ['$http', '$q', function ($http, $q) {
        var factory = {};

        factory.getMovies = function (searchquery) {

            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: 'http://api.themoviedb.org/3/' + 'search/movie?api_key=a8f7039633f2065942cd8a28d7cadad4' + '&query=' + encodeURIComponent(searchquery) + '&callback=JSON_CALLBACK'
            })
                .success(function (data) {
                    deferred.resolve(data.results);
                })
                .error(function () {
                    deferred.reject();
                });
            return deferred.promise;

        }

        return factory;

    }]);