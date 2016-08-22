app = angular.module('movieSeat', ['ngMaterial', 'ngFitText', 'ui-notification']);

app.config([
    'NotificationProvider', function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 4500,
            startTop: 95,
            startRight: 10,
            verticalSpacing: 200,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    }
]);
