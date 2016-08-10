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