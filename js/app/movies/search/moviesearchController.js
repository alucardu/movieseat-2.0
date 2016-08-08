angular.module('movieSeat')
    .controller('moviesearchCtrl', ['moviesearchFactory', '$scope', '$q', '$timeout', function (moviesearchFactory, $scope, $q, $timeout) {

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