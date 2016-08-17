angular.module('movieSeat')
    .controller('loginCtrl', ['$scope', '$http', function($scope, $http){
        $scope.signIn = function(username, password){

            $http.post('/login', {username:username, password:password}).then(function(response){
                if(response.data.success){
                    console.log('logged in');
                } else{
                    console.log('not logged in');
                }
            })
        }
    }]);