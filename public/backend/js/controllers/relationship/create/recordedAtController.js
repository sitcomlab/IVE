var app = angular.module("ive");

// Relationship recorded_at create controller
app.controller("recordedAtCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $locationService, $videoService) {

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
            $scope.createRelationshipForm.preferred.$pristine = false;
        } else {
            $scope.changeTab(0);
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
    $scope.updateDropdown = function(label){

        switch (label) {
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
                        $scope.changeTab(1);
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
    $scope.relationship = $relationshipService.init('recorded_at');

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
