angular.module('movieSeat')
    .controller('getmovieController', ['getmovieFactory', '$scope', '$filter', '$q', function (getmovieFactory, $scope, $filter, $q) {

        var getmovieFactoryFN = function(){
            getmovieFactory.getMovies().then(function(response){

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

    }]);