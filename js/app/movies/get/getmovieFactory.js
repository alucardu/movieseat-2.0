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