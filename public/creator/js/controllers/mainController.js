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

    $scope.submitLogin = function() {
        // Validate input
        if($scope.loginForm.$invalid) {
            // Update UI
            $scope.loginForm.username.$pristine = false;
            $scope.loginForm.password.$pristine = false;
        } else {
            $scope.loading = { status: true, message: $filter('translate')('LOGGING_IN') };
            $authenticationService.login($scope.login)
                .then(function onSuccess(user) {
                    $scope.loggingIn = false;
                    $scope.authenticated_user = user;
                    $scope.loading = { status: false, message: "" };
                })
                .catch(function onError(response) {
                    window.alert(response.data);
                    $scope.login.password = "";
                    $scope.$parent.loading = { status: false, message: "" };
                });
        }
    };

    $scope.logout = function () {
        $scope.loggingIn = true;
        $scope.authenticated_user = null;
        $authenticationService.logout();
    }


	/*************************************************
        INIT
     *************************************************/
	$scope.config = config;
    $scope.login = {};
    $scope.loginForm = {};
    $scope.loggingIn = false; // if true, login modal is shown.

    // populate form with default credentials
    $scope.login = $authenticationService.init();

    // check authentication, if missing, show login modal.
	$scope.authenticated_user = $authenticationService.get();
    if (!$scope.authenticated_user) $scope.loggingIn = true

	$scope.loading = { status: false, message: "" };

});
