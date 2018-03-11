var app = angular.module("ive_cms");

app.controller("aboutController", function ($scope, $rootScope, $location, $window, config, $authenticationService) {
    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };
});
