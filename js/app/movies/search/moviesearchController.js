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