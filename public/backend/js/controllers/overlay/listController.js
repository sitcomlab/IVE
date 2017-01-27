var app = angular.module("ive");

// Overlay list controller
app.controller("overlayListController", function($scope, $rootScope, $translate, $location, config, $window, $authenticationService, $overlayService) {

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

    // Load overlays
    $overlayService.list()
    .then(function onSuccess(response) {
        $scope.overlays = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
