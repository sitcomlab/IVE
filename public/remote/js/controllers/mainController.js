var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, config, $routeParams, $filter, $location, $translate, $scenarioService, $locationService, $videoService, $socket) {

    // Load Scenarios
    $scope.load_scenarios = function(){

        // Load all scenarios
        $scenarioService.list().success(function(response) {
            $scope.scenarios = response;
        }).error(function(err) {
            $scope.err = err;
        });

    };

    // Load Location
    $scope.load_locations = function(){

        // Load all related locations
        $locationService.list_by_scenario($scope.currentScenario.scenario_id).success(function(response) {
            $scope.locations = response;
        }).error(function(err) {
            $scope.err = err;
        });

    };

    // Load Location
    $scope.load_videos = function(){

        // Load all related videos
        $videoService.list_by_location($scope.currentLocation.location_id).success(function(response) {
            $scope.videos = response;
        }).error(function(err) {
            $scope.err = err;
        });

    };


    /**
     * [setCurrentScenario description]
     * @param {[type]} scenario [description]
     */
    $scope.setCurrentScenario = function(scenario){
        $scope.currentScenario.scenario_id = scenario.scenario_id;
        $scope.currentScenario.name = scenario.name;
        $scope.currentScenario.status = true;
        $scope.load_locations();

        // Send socket message
        $socket.emit('/set/scenario', {
            scenario_id: scenario.scenario_id
        });
    };

    /**
     * [setCurrentLocation description]
     * @param {[type]} location [description]
     */
    $scope.setCurrentLocation = function(location){
        $scope.currentLocation.location_id = location.location_id;
        $scope.currentLocation.name = location.name;
        $scope.currentLocation.status = true;
        $scope.load_videos();
        //TODO: $scope.load_connected_locations();

        // Send socket message
        $socket.emit('/set/location', {
            location_id: location.location_id
        });
    };



    // Init
    $scope.currentScenario = {
        status: false
    };
    $scope.currentLocation = {
        status: false
    };
    $scope.load_scenarios();

});
