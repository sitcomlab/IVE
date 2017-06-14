var app = angular.module("ive");

// Login controller
app.controller("loginController", function($scope, $rootScope, $filter, $translate, $location, config, $authenticationService, $window) {

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
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.loginForm.$invalid) {
            // Update UI
            $scope.loginForm.username.$pristine = false;
            $scope.loginForm.password.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('LOGGING_IN') };

            $authenticationService.login($scope.login)
            .then(function onSuccess(response) {
                $authenticationService.set(response.data);

                // Reset navbar
                $scope.$parent.authenticated_user = $authenticationService.get();
                $scope.$parent.loading = { status: false, message: "" };

                // Redirect
                $location.url("/scenarios");
            })
            .catch(function onError(response) {
                $window.alert(response.data);

                // Reset
                $scope.login.password = "";
                $scope.$parent.loading = { status: false, message: "" };
            });
        }
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_APPLICATION') };

    // Reset all services
    $authenticationService.set();

    // Reset navbar
    $scope.$parent.authenticated_user = $authenticationService.get();

    // Reset login
    $scope.login = $authenticationService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
