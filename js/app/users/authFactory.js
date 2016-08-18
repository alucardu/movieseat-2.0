angular.module('movieSeat')
    .factory('authFactory',['$http', 'identityFactory', '$q', function($http, identityFactory, $q){
        return{
            authenticateUSer: function(username, password){
                var dfd = $q.defer();
                $http.post('auth/login', {username:username, password:password}).then(function(response){
                    if(response.data.success){
                        identityFactory.currentUser = response.data.user;
                        dfd.resolve(true);
                    } else{
                        dfd.resolve(false);
                    }
                });
                return dfd.promise;
            }
        }
    }]);