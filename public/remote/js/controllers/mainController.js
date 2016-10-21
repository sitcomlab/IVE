var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, config, $routeParams, $filter, $location, $translate, $scenarioService, $locationService, $videoService, $socket) {

    // Init
    $scope.current = {
        scenarioStatus: false,
        locationStatus: false,
        videoStatus: false
    };

    // Load all scenarios
    $scenarioService.list().success(function(response) {
        $scope.scenarios = response;
    }).error(function(err) {
        $scope.err = err;
    });

    // TEST-DATA
    $scope.overlays = [
        {
            overlay_id: 1,
            name: "Test",
            display: true
        }, {
            overlay_id: 2,
            name: "Test-2",
            display: false
        }
    ];

    /**
     * [setCurrentScenario description]
     * @param {[type]} scenario [description]
     */
    $scope.setCurrentScenario = function(scenario){
        $scope.current.scenario = scenario;
        $scope.current.scenarioStatus = true;

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
        $scope.current.locationStatus = true;

        // Send socket message
        $socket.emit('/set/location', {
            location_id: location.location_id
        });

        // Load all related videos
        $videoService.list_by_location($scope.current.location.location_id).success(function(response) {
            $scope.videos = response;

            if($scope.videos.length !== 0){
                $scope.current.video = $scope.videos[0]; // TODO: Change database schema for better preselecting
                $scope.current.videoStatus = true;

                // Send socket message
                $socket.emit('/set/video', {
                    video_id: $scope.current.video.video_id
                });

            } else {
                $scope.current.videoStatus = false;
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
        $scope.current.videoStatus = true;

        // Send socket message
        $socket.emit('/set/video', {
            video_id: video.video_id
        });
    };



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
     * [resetScenario description]
     */
    $scope.resetScenario = function(){
        delete $scope.current;
        $scope.current = {
            scenarioStatus: false,
            locationStatus: false,
            videoStatus: false
        };

        // Send socket message
        $socket.emit('/reset/scenario', {});
    };

    /**
     * [resetLocation description]
     */
    $scope.resetLocation = function(){
        delete $scope.current.location;
        delete $scope.current.video;
        $scope.current.scenarioStatus = true;
        $scope.current.locationStatus = false;
        $scope.current.videoStatus = false;

        // Send socket message
        $socket.emit('/reset/location', {});
    };


});
