var app = angular.module("ive");

// Scenario details controller
app.controller("scenarioDetailsController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $scenarioService, $locationService, $videoService, $overlayService) {

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
            $scope.redirect("/scenarios");
        } else {
            $scope.redirect("/");
        }
    };

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
    $scope.changeTab(0);
    $scope.relatedLocations = false;
    $scope.relatedVideos = false;
    $scope.relatedOverlays = false;

    // Load scenario
    $scenarioService.retrieve($routeParams.scenario_id)
    .then(function onSuccess(response) {
        $scope.scenario = response.data;
        $scope.changeTab(1);

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
