var app = angular.module("ive");

// Scenario details controller
app.controller("scenarioDetailsController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $scenarioService, $locationService, $videoService, $overlayService) {

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
     * [toggle description]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.toggle = function(item){
        switch (item) {
            case 'relatedLocations': {
                $scope.relatedLocations = !$scope.relatedLocations;
                break;
            }
            case 'relatedVideos': {
                $scope.relatedVideos = !$scope.relatedVideos;
                break;
            }
            case 'relatedOverlays': {
                $scope.relatedOverlays = !$scope.relatedOverlays;
                break;
            }
        }
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_SCENARIO') };

    $scope.relatedLocations = false;
    $scope.relatedVideos = false;
    $scope.relatedOverlays = false;

    // Load scenario
    $scenarioService.retrieve($routeParams.scenario_id)
    .then(function onSuccess(response) {
        $scope.scenario = response.data;
        $scope.$parent.loading = { status: false, message: "" };

        // Load related locations
        $locationService.list_by_scenario($scope.scenario.scenario_id)
        .then(function onSuccess(response) {
            $scope.scenario.locations = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

        // Load related videos
        $videoService.list_by_scenario($scope.scenario.scenario_id)
        .then(function onSuccess(response) {
            $scope.scenario.videos = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

        // Load related overlays
        $overlayService.list_by_scenario($scope.scenario.scenario_id)
        .then(function onSuccess(response) {
            $scope.scenario.overlays = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
