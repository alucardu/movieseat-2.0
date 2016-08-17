angular.module('movieSeat')
    .controller('loginCtrl', ['$scope', '$http', 'Notification', 'identityFactory', 'authFactory', function($scope, $http, Notification, identityFactory, authFactory){

        $scope.identity = identityFactory;
        $scope.signIn = function(username, password){

            authFactory.authenticateUSer(username, password).then(function(success){
                if(success){
                    Notification.success('You have logged in');
                } else {
                    Notification.error('Incorrect username/password combination');

                }
            });
        }
    }]);