var app = angular.module("ive");

// Relationship embedded_in create controller
app.controller("embeddedInCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $videoService, $overlayService) {

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
            $scope.changeTab(0);

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
    $scope.updateDropdown = function(label){

        switch (label) {
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
                        $scope.changeTab(1);
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
                        $scope.changeTab(1);
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

                        // Update UI
                        $scope.videoDropdown.status = false;
                        $scope.changeTab(1);
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

                        // Update UI
                        $scope.videoDropdown.status = false;
                        $scope.changeTab(1);
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                }
                break;
            }
        }
     };


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.relationship = $relationshipService.init('embedded_in');

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
