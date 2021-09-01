var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, config, $routeParams, $filter, $location, $translate, $scenarioService, $locationService, $videoService, $overlayService, $relationshipService, $socket, _) {

    // Init
    $scope.current = {
        scenarioStatus: false,
        locationStatus: false
    };

    $scope.pointingOverlay = {};
    $scope.pointingOverlay.display = false;

    // Load all scenarios
    $scenarioService.list()
    .then(function onSuccess(response) {
        $scope.scenarios = response.data;
    }).catch(function onError(response) {
        $scope.err = response.data;
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
        $locationService.list_by_scenario($scope.current.scenario.scenario_id)
        .then(function onSuccess(response) {
            $scope.locations = response.data;
        }).catch(function onError(response) {
            $scope.err = response.data;
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
        $videoService.list_by_location($scope.current.location.location_id)
        .then(function onSuccess(response) {
            $scope.videos = response.data;

            if($scope.videos.length !== 0){

                const preferredVideo = _.findWhere($scope.videos, {
                    preferred: true
                });

                if(preferredVideo === -1){
                    delete $scope.current.video;
                } else {
                    $scope.setCurrentVideo(preferredVideo);
                }
            }
        }).catch(function onError(response) {
            $scope.err = response.data;
        });

        // Load all connected locations
        $locationService.list_by_location($scope.current.location.location_id)
        .then(function onSuccess(response) {
            $scope.connected_locations = response.data;
        }).catch(function onError(response) {
            $scope.err = response.data;
        });

    };

    /**
     * [setCurrentVideo description]
     * @param {[type]} video [description]
     */
    $scope.setCurrentVideo = function(video){
        $scope.current.video = video;


        // Load all related overlays
        $overlayService.list_by_video($scope.current.video.video_id)
        .then(function onSuccess(response) {
            // Make sure the overlays are in the scenario
            $scope.filter = {};
            $scope.filter.relationship_type = "overlay";
            $relationshipService.list_by_label("belongs_to", $scope.pagination, $scope.filter)
                .then(function(responseBelongsTo){
                    $scope.filter = undefined;
                    $scope.overlays = [];
                    for(let i = 0; i < response.data.length; i++){
                        for(let k = 0; k < responseBelongsTo.data.length; k++){
                            if(response.data[i].overlay_id === responseBelongsTo.data[k].overlay_id && responseBelongsTo.data[k].scenario_id === $scope.current.scenario.scenario_id){
                                let exists = false;
                                if($scope.overlays.length > 0){
                                    for(let j = 0; j < $scope.overlays.length; j++){
                                        if($scope.overlays[i] === response.data[i]){
                                            exists = true;
                                        }
                                        if(j === $scope.overlays.length - 1 && exists === false){
                                            $scope.overlays.push(response.data[i]);
                                        }
                                    }
                                }
                                else{
                                    $scope.overlays.push(response.data[i]);
                                }
                            }
                        }
                    }
                }).catch(function onError(responseBelongsTo) {
                    $scope.err = responseBelongsTo.data;
                });
        }).catch(function onError(response) {
            $scope.err = response.data;
        });

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
        for(let i = 0; i < $scope.overlays.length; i++){
            if($scope.overlays[i].overlay_id === overlay.overlay_id){
                if($scope.overlays[i].display){
                    $scope.overlays[i].display = false;
                } else {
                    $scope.overlays[i].display = true;
                }

                // Send socket message
                $socket.emit('/toggle/overlay', {
                    overlay_id: overlay.overlay_id,
                    display: $scope.overlays[i].display,
                    type: $scope.overlays[i].category
                });
            }
        }
    };

    // Switch the point overlay on and off
    $scope.togglePointingOverlay = function(){
        if($scope.pointingOverlay.display){
            $scope.pointingOverlay.display = false;
        } else {
            $scope.pointingOverlay.display = true;
        }

        // Send socket message
        $socket.emit('/toggle/pointing', {
            display: $scope.pointingOverlay.display
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
        $scenarioService.retrieve(data.scenario_id)
        .then(function onSuccess(response) {
            delete $scope.current.scenario;
            delete $scope.current.location;

            $scope.current.scenario = response.data;
            $scope.current.scenarioStatus = false;
            $scope.current.locationStatus = false;

            // Load all related locations
            $locationService.list_by_scenario($scope.current.scenario.scenario_id)
            .then(function onSuccess(response) {
                $scope.locations = response.data;
            }).catch(function onError(response) {
                $scope.err = response.data;
            });

        }).catch(function onError(response) {
            $scope.err = response.data;
        });

    });

    /**
     * [location description]
     * @type {String}
     */
    $socket.on('/set/location', function(data) {
        console.log(new Date() + " /set/location: " + data.location_id);

        // Load Location
        $locationService.retrieve(data.location_id)
        .then(function onSuccess(response) {
            $scope.current.location = response.data;

            // Load all related videos
            $videoService.list_by_location($scope.current.location.location_id)
            .then(function onSuccess(response) {
                $scope.videos = response.data;

                if($scope.videos.length !== 0){

                    $scope.current.video = _.findWhere($scope.videos, {
                        preferred: true
                    });
                }

            }).catch(function onError(response) {
                $scope.err = response.data;
            });

            // Load all connected locations
            $locationService.list_by_location($scope.current.location.location_id)
            .then(function onSuccess(response) {
                $scope.connected_locations = response.data;
            }).catch(function onError(response) {
                $scope.err = response.data;
            });

        }).catch(function onError(response) {
            $scope.err = response.data;
        });

    });

    /**
     * [video description]
     * @type {String}
     */
    $socket.on('/set/video', function(data) {
        console.log(new Date() + " /set/video: " + data.video_id);

        // Load Video
        $videoService.retrieve(data.video_id)
        .then(function onSuccess(response) {
            $scope.current.video = response.data;
        }).catch(function onError(response) {
            $scope.err = response.data;
        });
    });

});
