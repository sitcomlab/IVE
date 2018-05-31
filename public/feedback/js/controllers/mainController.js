var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, config, $routeParams, $filter, $location, $translate, $socket, _) {

    /**
     * [sendComment description]
     * @param {[type]} comment [description]
     */
    $scope.sendComment = function(){

        // Send socket message
        $socket.emit('/post/feedback', {
            vote: $scope.feedback.vote,
            comment: $scope.feedback.comment
        });
    };

});
