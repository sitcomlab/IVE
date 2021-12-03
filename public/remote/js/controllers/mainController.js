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

    $scope.pointingOverlay = { display: false };

    // Load all scenarios
    $scenarioService.list()
        .then(res => { $scope.scenarios = res.data; })
        .catch(res => { $scope.err = res.data; });

    // load previous state from server if available
    $socket.emit('/get/state')

    $scope.toggleScenarios = function() {
        $scope.current.scenarioStatus = !$scope.current.scenarioStatus;
    };

    $scope.toggleLocations = function() {
        $scope.current.locationStatus = !$scope.current.locationStatus;
    };

    $scope.onSelectScenario = function(scenario){
        setCurrentScenario(scenario);
        // sync other remote clients & server state
        $socket.emit('/set/scenario', { scenario_id: scenario.scenario_id });
    };

    $scope.onSelectLocation = function(location){
        setCurrentLocation(location, undefined);
        // sync other remote clients & server state
        if(location.location_type == "transition") {
            $socket.emit('/set/location', { location_id: location.location_id, location_type: location.location_type, length: location.length });
        } else {
            $socket.emit('/set/location', { location_id: location.location_id, location_type: location.location_type });
        }
    };

    $scope.onSelectVideo = async function(video){
        await setCurrentVideoOverlays(video, undefined);
        // sync other remote clients & server state
        $socket.emit('/set/video', { video_id: video.video_id, overlays: $scope.overlays });
    };

    $scope.toggleOverlay = function(overlay){
        for(let i = 0; i < $scope.overlays.length; i++){
            if($scope.overlays[i].overlay_id === overlay.overlay_id){
                $scope.overlays[i].display = !$scope.overlays[i].display;

                // sync other remote clients & server state
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
        $scope.pointingOverlay.display = !$scope.pointingOverlay.display;
        // sync other remote clients & server state
        $socket.emit('/toggle/pointing', { display: $scope.pointingOverlay.display });
    };

    function setCurrentScenario (scenario) {
        if (!scenario) return
        delete $scope.current.scenario;
        delete $scope.current.location;
        $scope.current.scenario = scenario;
        $scope.current.scenarioStatus = false;
        $scope.current.locationStatus = false;

        // Load all related locations
        return $locationService.list_by_scenario($scope.current.scenario.scenario_id)
            .then(function onSuccess(response) {
                $scope.locations = response.data;
            }).catch(function onError(response) {
                $scope.err = response.data;
            });
    };

    function setCurrentLocation (location, overlays) {
        if (!location) return
        $scope.current.location = location;

        // Load all related videos
        const videosP = $videoService.list_by_location($scope.current.location.location_id)
            .then(async function onSuccess(response) {
                $scope.videos = response.data;

                if($scope.videos.length !== 0){

                    const preferredVideo = _.findWhere($scope.videos, {
                        preferred: true
                    });

                    if(preferredVideo === -1){
                        delete $scope.current.video;
                    } else {
                        await setCurrentVideoOverlays(preferredVideo, overlays);
                        $socket.emit('/set/video', { video_id: preferredVideo.video_id, overlays: $scope.overlays});
                    }
                }
            });

        // Load all connected locations
        const connectedLocsP = $locationService.list_by_location($scope.current.location.location_id)
            .then(function onSuccess(response) {
                $scope.connected_locations = response.data
                    .filter(location =>  location.location_type !== 'transition');
                $scope.connected_transitions = response.data
                    .filter(location =>  location.location_type === 'transition');
            })

        return Promise.all([videosP, connectedLocsP])
            .catch(function onError(response) {
                $scope.err = response.data;
            });
    };

    function setCurrentVideoOverlays (video, overlay) {
        if (!video) return
        $scope.current.video = video;

        // Load all related overlays
        return $overlayService.list_by_video($scope.current.video.video_id)
            .then(function onSuccess(response) {
                // Make sure the overlays are in the scenario
                const filter = { relationship_type: "overlay" };
                return $relationshipService.list_by_label("belongs_to", $scope.pagination, filter)
                    .then(function(responseBelongsTo){
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
                                            if(j === $scope.overlays.length - 1 && !exists){
                                                if (overlay && Object.keys(overlay).length > 0 && typeof overlay[response.data[i].overlay_id] !== "undefined") {
                                                    response.data[i].display = overlay[response.data[i].overlay_id].display;
                                                    response.data[i].default = overlay[response.data[i].overlay_id].default;
                                                }
                                                $scope.overlays.push(response.data[i]);
                                            }
                                        }
                                    }
                                    else{
                                        if (overlay && Object.keys(overlay).length > 0 && typeof overlay[response.data[i].overlay_id] !== "undefined") {
                                            response.data[i].display = overlay[response.data[i].overlay_id].display;
                                            response.data[i].default = overlay[response.data[i].overlay_id].default;
                                        }
                                        $scope.overlays.push(response.data[i]);
                                    }
                                }
                            }
                        }
                    });
            }).catch(function onError(response) {
                $scope.err = response.data;
            });
    }

    $socket.on('/set/scenario', function(data) {
        $scenarioService.retrieve(data.scenario_id)
        .then(function onSuccess(response) {
            return setCurrentScenario(response.data);
        }).catch(function onError(response) {
            $scope.err = response.data;
        });

    });

    $socket.on('/set/location', function(data) {
        $locationService.retrieve(data.location_id)
        .then(function onSuccess(response) {
            return setCurrentLocation(response.data, undefined);
        }).catch(function onError(response) {
            $scope.err = response.data;
        });

    });

    $socket.on('/set/video', function(data) {
        $videoService.retrieve(data.video_id)
        .then(function onSuccess(response) {
            let overlays = {};
            if (data.overlays) {
                for (let i=0; i < data.overlays.length; i++) {
                    overlays[data.overlays[i].overlay_id] = {}
                    overlays[data.overlays[i].overlay_id].display = data.overlays[i].display;
                    overlays[data.overlays[i].overlay_id].default = (typeof data.overlays[i].default != "undefined") ? data.overlays[i].default : data.overlays[i].display;
                }
            }
            return setCurrentVideoOverlays(response.data, overlays);
        }).catch(function onError(response) {
            $scope.err = response.data;
        });
    });

    $socket.on('/toggle/overlay', function(data) {
        for (let i = 0; i < $scope.overlays.length; i++) {
            if ($scope.overlays[i].overlay_id === data.overlay_id) {
                $scope.overlays[i].display = data.display
                $scope.overlays[i].default = data.default
            }
        }
    });


    // apply state
    $socket.on('/get/state', function(state) {
        console.log(state);
        const { scenario, location, video, overlay } = state
        // TODO: overlays

        Promise.all([
            setCurrentScenario(scenario),
            setCurrentLocation(location, overlay),
            setCurrentVideoOverlays(video, overlay)
        ]).catch(res => {
            $scope.err = res.data
        })
    });
});
