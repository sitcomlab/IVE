var app = angular.module("ive");


/**
 * Footer Controller
 */
app.controller("footerController", function($scope, $rootScope, config, $translate, $window, $socket) {
    $scope.config = config;

    $scope.settingsStatus = false;

    $socket.emit('/get/logging');

    $scope.toggleSettings = function(){
        $scope.settingsStatus = !$scope.settingsStatus;
    };

    $scope.toggleLogging = function() {
        $socket.emit('/toggle/logging', {});
    };

    $socket.on('/get/logging', function(state) {
        $scope.logging = state;
    });

});
