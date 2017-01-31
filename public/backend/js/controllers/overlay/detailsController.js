var app = angular.module("ive");

// Overlay details controller
app.controller("overlayDetailsController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $overlayService) {

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


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);

    // Load video
    $overlayService.retrieve($routeParams.overlay_id)
    .then(function onSuccess(response) {
        $scope.overlay = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
