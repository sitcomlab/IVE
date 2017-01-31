var app = angular.module("ive");

// Location details controller
app.controller("locationDetailsController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $locationService, $videoService, $overlayService) {

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
    $scope.connectedLocations = true;


    // Load location
    $locationService.retrieve($routeParams.location_id)
    .then(function onSuccess(response) {
        $scope.location = response.data;
        $scope.changeTab(1);

        // Load connected locations
        $locationService.list_by_location($scope.location.location_id)
        .then(function onSuccess(response) {
            $scope.location.connected_locations = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

        // Load related videos
        /*$videoService.list_by_location($scope.location.location_id)
        .then(function onSuccess(response) {
            $scope.location.videos = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });*/

    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
