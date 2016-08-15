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