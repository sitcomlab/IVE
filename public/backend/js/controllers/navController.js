var app = angular.module("ive");


/**
 * Nav Controller
 */
app.controller("navController", function($scope, $rootScope, $location, $window, config, $authenticationService) {

    /*************************************************
        FUNCTIONS
     *************************************************/

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function(path){
        $location.url(path);
    };

    /**
     * [logout description]
     * @return {[type]} [description]
     */
    $scope.logout = function(){
        delete $scope.authenticated_user;
        $scope.redirect("/");
    };


    /*************************************************
        EVENT LISTENERS
     *************************************************/

    /**
     * [document description]
     * @type {[type]}
     */
    $rootScope.$on('updateNavbar', function() {
        $scope.authenticated_user = $authenticationService.get();
    });


    /**
     *
     */
    $rootScope.$on('resetNavbar', function() {
        delete $scope.authenticated_user;
    });


    /*************************************************
        INIT
     *************************************************/
    $scope.config = config;

});
