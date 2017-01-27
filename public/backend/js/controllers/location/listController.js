var app = angular.module("ive");

// Location list controller
app.controller("locationListController", function($scope, $rootScope, $translate, $location, config, $window, $authenticationService, $locationService) {

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

    // Load locations
    $locationService.list()
    .then(function onSuccess(response) {
        $scope.locations = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
