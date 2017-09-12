var app = angular.module("ive");

// Relationship recorded_at create controller
app.controller("recordedAtCreateController", function($scope, $rootScope, $routeParams, $interval, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $locationService, $videoService, _) {

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
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.createRelationshipForm.$invalid) {
            // Update UI
            $scope.createRelationshipForm.preferred.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_RELATIONSHIP') };

            $relationshipService.create('recorded_at', $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationship/recorded_at/" + $scope.relationship.relationship_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };

    /**
     * [updateDropdown description]
     * @return {[type]} [description]
     */
    $scope.updateDropdown = function(relationship_label){

        switch (relationship_label) {
            case 'videos': {
                if($scope.videoDropdown.scenario_id !== ""){
                    $videoService.list_by_scenario($scope.videoDropdown.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.videos = response.data;

                        // Select first video in dropdown
                        var first_video;
                        if($scope.videos.length > 0){
                            first_video = $scope.videos[0].video_id;
                        }
                        $scope.relationship.video_id = first_video;
                        $scope.findVideo();

                        // Update UI
                        $scope.videoDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                } else {
                    $videoService.list()
                    .then(function onSuccess(response) {
                        $scope.videos = response.data;

                        // Select first video in dropdown
                        var first_video;
                        if($scope.videos.length > 0){
                            first_video = $scope.videos[0].video_id;
                        }
                        $scope.relationship.video_id = first_video;
                        $scope.findVideo();

                        // Update UI
                        $scope.videoDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                }
                break;
            }
            case 'locations': {
                if($scope.locationDropdown.scenario_id !== ""){
                    $locationService.list_by_scenario($scope.locationDropdown.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.locations = response.data;

                        // Select first location in dropdown
                        var first_location;
                        if($scope.locations.length > 0){
                            first_location = $scope.locations[0].location_id;
                        }
                        $scope.relationship.location_id = first_location;

                        // Update UI
                        $scope.locationDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                } else {
                    $locationService.list()
                    .then(function onSuccess(response) {
                        $scope.locations = response.data;

                        // Select first location in dropdown
                        var first_location;
                        if($scope.locations.length > 0){
                            first_location = $scope.locations[0].location_id;
                        }
                        $scope.relationship.location_id = first_location;

                        // Update UI
                        $scope.locationDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                }

                break;
            }
        }
    };

    /**
     * [description]
     * @return {[type]} [description]
     */
    $scope.findVideo = function(){
        if($scope.relationship.video_id !== null){
            $scope.selectedVideo = _.findWhere($scope.videos, { video_id: $scope.relationship.video_id });
            $scope.selectedVideo.thumbnail = $filter('thumbnail')($scope.selectedVideo, 1);
        } else {
            $scope.selectedVideo;
        }
    };


    /**
     * [startPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.startPreview = function(video) {
        // store the interval promise
        $scope.currentPreview = 1;
        $scope.maxPreview = video.thumbnails;

        // stops any running interval to avoid two intervals running at the same time
        $interval.cancel(promise);

        // store the interval promise
        promise = $interval(function() {
            if($scope.selectedVideo.thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.selectedVideo.thumbnail = $filter('thumbnail')($scope.selectedVideo, $scope.currentPreview);
            }
            $scope.currentPreview++;
        }, config.thumbnailSpeed);
    };

    /**
     * [stopPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.stopPreview = function(video) {
        $interval.cancel(promise);
    };


    /*************************************************
        LISTENERS
     *************************************************/
    $scope.$on('$destroy', function() {
        $interval.cancel(promise);
    });


    /*************************************************
        INIT
     *************************************************/
    $scope.relationship = $relationshipService.init('recorded_at');
    $scope.selectedVideo;
    $scope.$parent.loading = { status: false, message: "" };
    var promise;

    // Prepare dropdowns
    $scope.videoDropdown = {
        scenario_id: "",
        status: true
    };
    $scope.locationDropdown = {
        scenario_id: "",
        status: true
    };
    $scope.updateDropdown('videos');
    $scope.updateDropdown('locations');

    // Load scenarios for dropdowns
    $scenarioService.list()
    .then(function onSuccess(response) {
        $scope.scenarios = response.data;
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
