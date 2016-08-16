app = angular.module('movieSeat', ['ngMaterial', 'ngFitText', 'ui-notification']);

app.config([
    'NotificationProvider', function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 4500,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    }
]);

angular.module('movieSeat')
    .factory('movieFactory', ['$http', '$q', function ($http, $q) {

        var factory = {};

        factory.selectMovie = function (movie) {
            var deferred = $q.defer();
            $http({
                method: 'JSONP',
                url: 'https://api.themoviedb.org/3/movie/' + movie.id + '?api_key=a8f7039633f2065942cd8a28d7cadad4&append_to_response=credits,images,videos&callback=JSON_CALLBACK'
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .catch(function () {
                    deferred.reject();
                });
            return deferred.promise;
        };

        factory.addMovie = function (movie) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/movies',
                data: movie
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .catch(function () {
                    deferred.reject();
                });
            return deferred.promise;
        };

        factory.removeMovie = function (movie) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: '/movies',
                data: movie,
                headers: {"Content-Type": "application/json;charset=utf-8"}
            })
                .success(function(data){
                    deferred.resolve(data);
                })
                .catch(function(){
                    deferred.reject();

                });

            return deferred.promise;
        };

        return factory;

    }]);
angular.module('movieSeat')
    .controller('moviesearchCtrl', ['$rootScope', 'getmovieFactory', 'movieFactory', 'moviesearchFactory', '$scope', '$q', '$timeout',  'Notification', function ($rootScope, getmovieFactory, movieFactory, moviesearchFactory, $scope, $q, $timeout, Notification ) {

        $scope.addMovie = function (movie)  {

            movieFactory.selectMovie(movie).then(function(response){
                movieFactory.addMovie(response);
                Notification.success(movie.title + ' has been added to your watchlist');
                $scope.movies = [];
                $scope.overlay = false;
                $scope.searchquery = '';
                $rootScope.$broadcast('onAddMovieEvent', movie);
            });
        };

        $scope.$on('onRemoveMovieEvent', function (event, movie) {
            movieFactory.removeMovie(movie).then(function(){
                Notification.success(movie.title + ' has been removed from your watchlist')
                $rootScope.$broadcast('onRemoveMovieEventUpdate', movie);
            })
        });


        $scope.closeSearch = function(){
            $scope.movies = [];
            $scope.overlay = false;
            $scope.searchquery = ''
        };

        $scope.overlay = false;
        $scope.showResult = false;
        $scope.createList = function (searchquery) {

            $scope.overlay = true;
            $scope.showResult = true;
            if ($scope.searchquery.length > 0) {
                $scope.showProgress = true;
                $scope.toggleSsomething =  false;

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
                            if (movie.release_date !== ''){
                                if (movie.overview == '' ) {
                                    movie.overview = 'No summary available';
                                }

                                $scope.moviesPreload.push({
                                    id: movie.id,
                                    movie_id: movie.id,
                                    poster_path : movie.poster_path,
                                    pre_load_poster_path: 'http://image.tmdb.org/t/p/w92' + movie.poster_path,
                                    title: movie.title,
                                    release_date: movie.release_date,
                                });
                            }
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
                $scope.toggleSsomething =  false;
                $scope.overlay = false;
                $scope.searchquery = ''
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
                // url: 'https://api.themoviedb.org/3/movie/330459?api_key=a8f7039633f2065942cd8a28d7cadad4&append_to_response=credits,images,videos'
                url: 'https://api.themoviedb.org/3/search/movie?api_key=a8f7039633f2065942cd8a28d7cadad4' + '&query=' + encodeURIComponent(searchquery) + '&callback=JSON_CALLBACK'
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
            console.log('onRemoveMovieEventUpdate!!!!');
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