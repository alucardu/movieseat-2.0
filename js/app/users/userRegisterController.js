angular.module('movieSeat')
    .controller('userRegisterCtrl', ['$scope', '$http', function($scope, $http) {

        $scope.register = function(username, password){

            $http.post('auth/register', {username:username, password:password});
        }

    }]);