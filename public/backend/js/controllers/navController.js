var app = angular.module("ive");


/**
 * Nav Controller
 */
app.controller("navController", function($scope, config) {
    $scope.config = config;
});
