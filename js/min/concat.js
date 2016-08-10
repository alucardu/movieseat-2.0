app = angular.module('movieSeat', ['ngMaterial', 'ngFitText']);

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
angular.module('movieSeat')
    .controller('getmovieController', ['getmovieFactory', '$scope', '$filter', function (getmovieFactory, $scope, $filter) {

        getmovieFactoryFN = function(){
            getmovieFactory.getMovies().then(function(response){

                $scope.movies = response;

                var watchlist = response;

                var orderBy = $filter('orderBy');
                var orderedWatchlist = orderBy(watchlist, "release_date", true);

                var i, j, temparray, chunk = 8;
                $scope.movieGroups = [];
                for (i=0,j=orderedWatchlist.length; i<j; i+=chunk) {
                    temparray = orderedWatchlist.slice(i,i+chunk);
                    $scope.movieGroups.push(temparray);
                }
            });
        };

        getmovieFactoryFN();

    }]);
angular.module('movieSeat')
    .factory('getmovieFactory', ['$http', '$q', function ($http, $q) {

        var factory = {};

        factory.getMovies = function () {

            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'movies'
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .catch(function () {
                    deferred.reject();
                });
            return deferred.promise;

        };

        return factory;

    }]);
angular.module('movieSeat')
    .controller('moviesearchCtrl', ['movieaddFactory', 'moviesearchFactory', '$scope', '$q', '$timeout' , function (movieaddFactory, moviesearchFactory, $scope, $q, $timeout) {

        $scope.addMovie = function (movie)  {

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

                moviesearchFactory.searchMovies(searchquery).then(function (response) {

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
                                poster_path : movie.poster_path,
                                pre_load_poster_path: 'http://image.tmdb.org/t/p/w92' + movie.poster_path,
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
                            promises.push(loadImage(image.pre_load_poster_path));
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

        factory.searchMovies = function (searchquery) {

            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: 'http://api.themoviedb.org/3/' + 'search/movie?api_key=a8f7039633f2065942cd8a28d7cadad4' + '&query=' + encodeURIComponent(searchquery) + '&callback=JSON_CALLBACK'
            })
                .success(function (data) {
                    deferred.resolve(data.results);
                })
                .catch(function () {
                    deferred.reject();
                });
            return deferred.promise;

        };

        return factory;

    }]);