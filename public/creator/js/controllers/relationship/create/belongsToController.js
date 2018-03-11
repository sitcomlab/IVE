var app = angular.module("ive");

// Relationship belongs_to create controller
app.controller("belongsToCreateController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $locationService, $videoService, $overlayService) {

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
        $scope.label = $scope.relationship_type;
        // Validate input
        if($scope.createRelationshipForm.$invalid) {
            // Update UI
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_RELATIONSHIP') };

            $relationshipService.create('belongs_to', $scope.relationship, $scope.label)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationships/belongs_to/" + $scope.relationship.relationship_id + "/" + $scope.label);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.relationship_type = $routeParams.relationship_type;
    $scope.relationship = $relationshipService.init('belongs_to', $scope.relationship_type);
    $scope.$parent.loading = { status: false, message: "" };

    // Load scenarios
    $scenarioService.list()
    .then(function onSuccess(response) {
        $scope.scenarios = response.data;

        // Select first scenario in dropdown
        if($scope.scenarios.length > 0){
            $scope.relationship.scenario_id = $scope.scenarios[0].scenario_id;
        }

        // Load locations
        $locationService.list()
        .then(function onSuccess(response) {
            $scope.locations = response.data;

            // Load videos
            $videoService.list()
            .then(function onSuccess(response) {
                $scope.videos = response.data;

                // Load overlays
                $overlayService.list()
                .then(function onSuccess(response) {
                    $scope.overlays = response.data;

                    // Select first element in dropdown
                    switch ($scope.relationship_type) {
                        case 'location': {
                            if($scope.locations.length > 0){
                                $scope.relationship.location_id = $scope.locations[0].location_id;
                            }
                            break;
                        }
                        case 'video': {
                            if($scope.videos.length > 0){
                                $scope.relationship.video_id = $scope.videos[0].video_id;
                            }
                            break;
                        }
                        case 'overlay': {
                            if($scope.overlays.length > 0){
                                $scope.relationship.overlay_id = $scope.overlays[0].overlay_id;
                            }
                            break;
                        }
                    }
                })
                .catch(function onError(response) {
                    $window.alert(response.data);
                });
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
