var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, config, $routeParams, $filter, $location, $translate, $scenarioService, $locationService, $videoService, $overlayService, $socket, _) {

    // Init
    $scope.current = {
        scenarioStatus: false,
        locationStatus: false
    };

    // Load all scenarios
    $scenarioService.list().success(function(response) {
        $scope.scenarios = response;
    }).error(function(err) {
        $scope.err = err;
    });


    /**
     * [toggleScenarios description]
     * @return {[type]} [description]
     */
    $scope.toggleScenarios = function() {
        if($scope.current.scenarioStatus){
            $scope.current.scenarioStatus = false;
        } else {
            $scope.current.scenarioStatus = true;
        }
    };


    /**
     * [toggleLocations description]
     * @return {[type]} [description]
     */
    $scope.toggleLocations = function() {
        if($scope.current.locationStatus){
            $scope.current.locationStatus = false;
        } else {
            $scope.current.locationStatus = true;
        }
    };


    /**
     * [setCurrentScenario description]
     * @param {[type]} scenario [description]
     */
    $scope.setCurrentScenario = function(scenario){
        delete $scope.current.scenario;
        delete $scope.current.location;
        $scope.current.scenario = scenario;
        $scope.current.scenarioStatus = false;
        $scope.current.locationStatus = false;

        // Load all related locations
        $locationService.list_by_scenario($scope.current.scenario.scenario_id).success(function(response) {
            $scope.locations = response;
        }).error(function(err) {
            $scope.err = err;
        });

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
        $scope.current.location = location;

        // Send socket message
        $socket.emit('/set/location', {
            location_id: location.location_id
        });

        // Load all related videos
        $videoService.list_by_location($scope.current.location.location_id).success(function(response) {
            $scope.videos = response;

            if($scope.videos.length !== 0){

                $scope.current.video = _.findWhere($scope.videos, {
                    preferred: true
                });

                if($scope.current.video === -1){
                    delete $scope.current.video;
                } else {
                    // Load all related overlays
                    $overlayService.list_by_video($scope.current.video.video_id).success(function(response){
                        $scope.overlays = response;
                    }).error(function(err) {
                        $scope.err = err;
                    });
                }
            }

        }).error(function(err) {
            $scope.err = err;
        });

        // Load all connected locations
        $locationService.list_by_location($scope.current.location.location_id).success(function(response) {
            $scope.connected_locations = response;
        }).error(function(err) {
            $scope.err = err;
        });

    };

    /**
     * [setCurrentVideo description]
     * @param {[type]} video [description]
     */
    $scope.setCurrentVideo = function(video){
        $scope.current.video = video;

        // Send socket message
        $socket.emit('/set/video', {
            video_id: video.video_id
        });
    };


    /**
     * [toggleOverlay description]
     * @param  {[type]} overlay [description]
     * @return {[type]}         [description]
     */
    $scope.toggleOverlay = function(overlay){
        if($scope.overlays[0].display){
            $scope.overlays[0].display = false;
        } else {
            $scope.overlays[0].display = true;
        }

        // Send socket message
        $socket.emit('/toggle/overlay', {
            overlay_id: overlay.overlay_id,
            display: $scope.overlays[0].display
        });
    };


    /**
     * [reset description]
     */
    $scope.reset = function(){

        // Send socket message
        $socket.emit('/reset/location', {});
    };



    /**
     * [scenario description]
     * @type {String}
     */
    $socket.on('/set/scenario', function(data) {
        console.log(new Date() + " /set/scenario: " + data.scenario_id);

        // Load Scenario
        $scenarioService.get(data.scenario_id).success(function(response) {
            delete $scope.current.scenario;
            delete $scope.current.location;

            $scope.current.scenario = response;
            $scope.current.scenarioStatus = false;
            $scope.current.locationStatus = false;

            // Load all related locations
            $locationService.list_by_scenario($scope.current.scenario.scenario_id).success(function(response) {
                $scope.locations = response;
            }).error(function(err) {
                $scope.err = err;
            });

        }).error(function(err) {
            $scope.err = err;
        });

    });

    /**
     * [location description]
     * @type {String}
     */
    $socket.on('/set/location', function(data) {
        console.log(new Date() + " /set/location: " + data.location_id);

        // Load Location
        $locationService.get(data.location_id).success(function(response) {
            $scope.current.location = response;

            // Load all related videos
            $videoService.list_by_location($scope.current.location.location_id).success(function(response) {
                $scope.videos = response;

                if($scope.videos.length !== 0){

                    $scope.current.video = _.findWhere($scope.videos, {
                        preferred: true
                    });

                    if($scope.current.video === -1){
                        delete $scope.current.video;
                    } else {
                        // Load all related overlays
                        $overlayService.list_by_video($scope.current.video.video_id).success(function(response){
                            $scope.overlays = response;
                        }).error(function(err) {
                            $scope.err = err;
                        });
                    }
                }

            }).error(function(err) {
                $scope.err = err;
            });

            // Load all connected locations
            $locationService.list_by_location($scope.current.location.location_id).success(function(response) {
                $scope.connected_locations = response;
            }).error(function(err) {
                $scope.err = err;
            });

        }).error(function(err) {
            $scope.err = err;
        });

    });

    /**
     * [video description]
     * @type {String}
     */
    $socket.on('/set/video', function(data) {
        console.log(new Date() + " /set/video: " + data.video_id);

        // Load Video
        $videoService.get(data.video_id).success(function(response) {
            $scope.current.video = response;
        }).error(function(err) {
            $scope.err = err;
        });
    });


});
