var app = angular.module("ive");


/**
 * Login Controller
 */
app.controller("loginController", function($scope, $rootScope, config, $location, $window, $authenticationService) {

    /*************************************************
        FUNCTIONS
     *************************************************/

    /**
     * [changeTab description]
     * @param  {[type]} tab [description]
     * @return {[type]}     [description]
     */
    $scope.changeTab = function(tab){
        $scope.tab = tab;
    };

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
            $scope.changeTab(0);

            $authenticationService.authenticate($scope.login)
            .then(function onSuccess(response) {
                $authenticationService.set(response.data);

                // Update navbar
                $rootScope.$broadcast('updateNavbar');

                $scope.redirect("/scenarios");
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });

        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);

    // Reset all services
    $authenticationService.set();

    // Reset navbar
    $rootScope.$broadcast('resetNavbar');

    // Reset login
    $scope.login = $authenticationService.init();
    $scope.changeTab(1);
});
