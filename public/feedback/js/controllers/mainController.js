var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $socket) {

    // Init
    $scope.feedback = {
        rating: null,
        comment: ""
    };

    /**
     * [send feedback]
     */
    $scope.send = function(){
        // Send socket message
        $socket.emit('/post/feedback', {
            rating: $scope.feedback.rating,
            comment: $scope.feedback.comment
        });
    };

});
