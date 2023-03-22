var app = angular.module("ive");

// Relationship connected_to create controller
app.controller("connectedToCreateController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $locationService) {

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
            $scope.createRelationshipForm.start_location_id.$pristine = false;
            $scope.createRelationshipForm.end_location_id.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_RELATIONSHIP') };

            $relationshipService.create('connected_to', $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationships/connected_to/" + $scope.relationship.relationship_id);
            })
            .catch(function onError(response) {
                if (response.data == "Token expired!") {
                    $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                    .then(res => { 
                        $authenticationService.updateUser(res.data);
                        $relationshipService.create('connected_to', $scope.relationship)
                        .then(function onSuccess(response) {
                            $scope.relationship = response.data;
                            $scope.redirect("/relationships/connected_to/" + $scope.relationship.relationship_id);
                        })
                        .catch(function onError(response) {
                            if (response.status > 0) {
                                $window.alert(response.data);
                            }
                        });
                    })
                } else {
                    $window.alert(response.data);
                }
            });
        }
    };

    /**
     * [updateDropdown description]
     * @return {[type]} [description]
     */
    $scope.updateDropdown = function(relationship_label){

        switch (relationship_label) {
            case 'locations': {
                if($scope.locationDropdown.scenario_id !== ""){
                    $locationService.list_by_scenario($scope.locationDropdown.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.locations = response.data;

                        var first_location;
                        if($scope.locations.length > 0){
                            first_location = $scope.locations[0].location_id;
                        }
                        $scope.relationship.start_location_id = first_location;
                        $scope.relationship.end_location_id = first_location;

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

                        var first_location;
                        if($scope.locations.length > 0){
                            first_location = $scope.locations[0].location_id;
                        }
                        $scope.relationship.start_location_id = first_location;
                        $scope.relationship.end_location_id = first_location;

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


    /*************************************************
        INIT
     *************************************************/
    $scope.relationship = $relationshipService.init('connected_to');
    $scope.$parent.loading = { status: false, message: "" };

    // Prepare dropdown
    $scope.locationDropdown = {
        scenario_id: "",
        status: true
    };
    $scope.updateDropdown('locations');

    // Load scenarios for dropdown
    $scenarioService.list()
    .then(function onSuccess(response) {
        $scope.scenarios = response.data;
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
