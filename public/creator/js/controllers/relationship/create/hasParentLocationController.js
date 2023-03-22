var app = angular.module("ive");

// Relationship has_parent_location create controller
app.controller("hasParentLocationCreateController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $locationService) {

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
            $scope.createRelationshipForm.child_location_id.$pristine = false;
            $scope.createRelationshipForm.has_parent_location_id.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_RELATIONSHIP') };

            $relationshipService.create('has_parent_location', $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationships/has_parent_location/" + $scope.relationship.relationship_id);
            })
            .catch(function onError(response) {
                if (response.data == "Token expired!") {
                    $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                    .then(res => { 
                        $authenticationService.updateUser(res.data);
                        $relationshipService.create('has_parent_location', $scope.relationship)
                        .then(function onSuccess(response) {
                            $scope.relationship = response.data;
                            $scope.redirect("/relationships/has_parent_location/" + $scope.relationship.relationship_id);
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
            case 'child_locations': {
                if($scope.childLocationDropdown.scenario_id !== ""){
                    $locationService.list_by_scenario($scope.childLocationDropdown.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.child_locations = response.data;

                        // Select first location in dropdown
                        var first_location;
                        if($scope.child_locations.length > 0){
                            first_location = $scope.child_locations[0].location_id;
                        }
                        $scope.relationship.child_location_id = first_location;

                        // Update UI
                        $scope.childLocationDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                } else {
                    $locationService.list()
                    .then(function onSuccess(response) {
                        $scope.child_locations = response.data;

                        // Select first location in dropdown
                        var first_location;
                        if($scope.child_locations.length > 0){
                            first_location = $scope.child_locations[0].location_id;
                        }
                        $scope.relationship.child_location_id = first_location;

                        // Update UI
                        $scope.childLocationDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                }

                break;
            }
            case 'parent_locations': {
                if($scope.parentLocationDropdown.scenario_id !== ""){
                    $locationService.list_by_scenario($scope.parentLocationDropdown.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.parent_locations = response.data;

                        // Select first location in dropdown
                        var first_location;
                        if($scope.parent_locations.length > 0){
                            first_location = $scope.parent_locations[0].location_id;
                        }
                        $scope.relationship.parent_location_id = first_location;

                        // Update UI
                        $scope.parentLocationDropdown.status = false;
                        $scope.$parent.loading = { status: false, message: "" };
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                    });
                } else {
                    $locationService.list()
                    .then(function onSuccess(response) {
                        $scope.parent_locations = response.data;

                        // Select first location in dropdown
                        var first_location;
                        if($scope.parent_locations.length > 0){
                            first_location = $scope.parent_locations[0].location_id;
                        }
                        $scope.relationship.parent_location_id = first_location;

                        // Update UI
                        $scope.parentLocationDropdown.status = false;
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
    $scope.relationship = $relationshipService.init('has_parent_location');
    $scope.$parent.loading = { status: false, message: "" };

    // Prepare dropdown
    $scope.childLocationDropdown = {
        scenario_id: "",
        status: true
    };
    $scope.parentLocationDropdown = {
        scenario_id: "",
        status: false
    };
    $scope.updateDropdown('child_locations');
    $scope.updateDropdown('parent_locations');

    // Load scenarios for dropdown
    $scenarioService.list()
    .then(function onSuccess(response) {
        $scope.scenarios = response.data;
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
