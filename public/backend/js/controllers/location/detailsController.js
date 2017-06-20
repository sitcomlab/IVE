var app = angular.module("ive");

// Location details controller
app.controller("locationDetailsController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $locationService, $videoService, $overlayService) {

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


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_LOCATION') };
    $scope.connectedLocations = true;


    // Load location
    $locationService.retrieve($routeParams.location_id)
    .then(function onSuccess(response) {
        $scope.location = response.data;
        $scope.$parent.loading = { status: false, message: "" };

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
