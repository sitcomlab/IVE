var app = angular.module("ive");

// Relationship embedded_in create controller
app.controller("embeddedInCreateController", function($scope, $rootScope, $routeParams, $interval, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $videoService, $overlayService, _) {

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
            $scope.createRelationshipForm.w.$pristine = false;
            $scope.createRelationshipForm.h.$pristine = false;
            $scope.createRelationshipForm.d.$pristine = false;
            $scope.createRelationshipForm.x.$pristine = false;
            $scope.createRelationshipForm.y.$pristine = false;
            $scope.createRelationshipForm.z.$pristine = false;
            $scope.createRelationshipForm.rx.$pristine = false;
            $scope.createRelationshipForm.ry.$pristine = false;
            $scope.createRelationshipForm.rz.$pristine = false;
            $scope.createRelationshipForm.display.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_RELATIONSHIP') };

            $relationshipService.create('embedded_in', $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationship/embedded_in/" + $scope.relationship.relationship_id);
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
            case 'overlays': {
                if($scope.overlayDropdown.scenario_id !== ""){
                    $overlayService.list_by_scenario($scope.overlayDropdown.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.overlays = response.data;

                        // Select first video in dropdown
                        var first_overlay;
                        if($scope.overlays.length > 0){
                            first_overlay = $scope.overlays[0].overlay_id;
                        }
                        $scope.relationship.overlay_id = first_overlay;

                        // Update UI
                        $scope.overlayDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                } else {
                    $overlayService.list()
                    .then(function onSuccess(response) {
                        $scope.overlays = response.data;

                        // Select first video in dropdown
                        var first_overlay;
                        if($scope.overlays.length > 0){
                            first_overlay = $scope.overlays[0].overlay_id;
                        }
                        $scope.relationship.overlay_id = first_overlay;

                        // Update UI
                        $scope.overlayDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                }
                break;
            }
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
    $scope.relationship = $relationshipService.init('embedded_in');
    $scope.selectedVideo;
    $scope.$parent.loading = { status: false, message: "" };
    var promise;

    // Prepare dropdowns
    $scope.overlayDropdown = {
        scenario_id: "",
        status: true
    };
    $scope.videoDropdown = {
        scenario_id: "",
        status: true
    };
    $scope.updateDropdown('overlays');
    $scope.updateDropdown('videos');

    // Load scenarios for dropdowns
    $scenarioService.list()
    .then(function onSuccess(response) {
        $scope.scenarios = response.data;
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
