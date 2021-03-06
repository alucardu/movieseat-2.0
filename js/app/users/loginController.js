angular.module('movieSeat')
    .controller('loginCtrl', ['$scope', '$http', 'Notification', 'identityFactory', 'authFactory','$location', function($scope, $http, Notification, identityFactory, authFactory, $location){

        $scope.identity = identityFactory;
        $scope.signIn = function(username, password){

            authFactory.authenticateUSer(username, password).then(function(success){
                if(success){
                    Notification.success('You have logged in');
                } else {
                    Notification.error('Incorrect username/password combination');

                }
            });
        };

        $scope.signOut = function(){
            authFactory.logoutUser().then(function(){
                $scope.username = '';
                $scope.password = '';
                Notification.success('You have successfully logged out!');
                $location.path('/');
                $scope.showSignIn = false;
                $scope.overlaySignIn = false;
            })
        }
    }]);