var app = angular.module("ive");


/**
 * Footer Controller
 */
app.controller("footerController", function($scope, $rootScope, config, $translate, $window, $socket) {
    $scope.config = config;

    $scope.settingsStatus = false;

    $socket.emit('/get/logstate');

    $scope.toggleSettings = function(){
        $scope.settingsStatus = !$scope.settingsStatus;
    };

    $scope.toggleLogging = function() {
        $socket.emit('/toggle/logging', {});
    };

    $socket.on('/get/logstate', function(state) {
        $scope.logging = state;
    });

    $socket.on('/get/logs', function(logs) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logs));
        element.setAttribute('download', 'logs-' + (new Date()).getTime() + '.csv');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    });

});
