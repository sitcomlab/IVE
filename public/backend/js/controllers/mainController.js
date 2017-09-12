var app = angular.module("ive");

// Main controller
app.controller("mainController", function($scope, $rootScope, $filter, $translate, $location, config, $authenticationService) {
	/*************************************************
        FUNCTIONS
     *************************************************/

	/**
     * [isActive description]
     * @param  {[type]}  viewLocation [description]
     * @return {Boolean}              [description]
     */
    $scope.isActive = function(viewLocation){
        var path = $location.path();
        if(path && viewLocation){
            if(path.indexOf(viewLocation) !== -1){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };


    /**
     * [description]
     * @return {[type]} [description]
     */
    $scope.isNotMapRoute = function(){
        var path = $location.path();
        if(path === '/map'){
            return false;
        } else {
            return true;
        }
    };


    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function(path){
        $location.url(path);
    };


	/*************************************************
        INIT
     *************************************************/
	$scope.config = config;

	$scope.authenticated_user = $authenticationService.get();
	$scope.loading = { status: false, message: "" };

});
