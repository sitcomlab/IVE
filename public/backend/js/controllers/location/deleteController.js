var app = angular.module("ive");

// Location delete controller
app.controller("locationDeleteController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $locationService) {

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
     * [cancel description]
     * @return {[type]} [description]
     */
    $scope.cancel = function(){
        if($authenticationService.get()){
            $scope.redirect("/locations");
        } else {
            $scope.redirect("/locations/" + $scope.location.location_id);
        }
    };

    /**
     * [delete description]
     * @return {[type]} [description]
     */
    $scope.delete = function(){
        $scope.changeTab(0);
        $locationService.remove($scope.location.location_id)
        .then(function onSuccess(response) {
            $scope.redirect("/locations");
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.input = "";

    // Load location
    $locationService.retrieve($routeParams.location_id)
    .then(function onSuccess(response) {
        $scope.location = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
