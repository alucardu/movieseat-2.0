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