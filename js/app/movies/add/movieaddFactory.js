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