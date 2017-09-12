var app = angular.module("ive");

// Help controller
app.controller("helpController", function($scope, config) {
    $scope.$parent.loading = { status: false, message: "" };
});
