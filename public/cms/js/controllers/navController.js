var app = angular.module("ive_cms");

app.controller("navController", function ($scope, $rootScope, $location, $window, config, $authenticationService) {

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    /**
     * [isActive description]
     * @param  {[type]}  viewLocation [description]
     * @return {Boolean}              [description]
     */
    $scope.isActive = function (viewLocation) {
        var path = $location.path();
        if (path.indexOf(viewLocation) !== -1) {
            return true;
        } else {
            return false;
        }
    };

    $scope.config = config;
});
