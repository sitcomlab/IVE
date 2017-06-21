var app = angular.module("ive");

// Map controller
app.controller("mapController", function($scope, $rootScope, $filter, $translate, $location, config, $authenticationService, $window) {
    $scope.$parent.loading = { status: false, message: "" };
});
