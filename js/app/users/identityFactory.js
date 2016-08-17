angular.module('movieSeat')
    .factory('identityFactory', function(){
        return{
            currentUser: undefined,
            isAuthenticated: function(){
                return !!this.currentUser;
            }
        }
    });