var app = angular.module("ive");


/**
 * Footer Controller
 */
app.controller("footerController", function($scope, $rootScope, config, $translate, $window) {
    $scope.config = config;

    $scope.settingsStatus = false;

    $scope.toggleSettings = function(){
        $scope.settingsStatus = !$scope.settingsStatus;
    };

});
