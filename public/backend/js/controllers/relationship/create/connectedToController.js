var app = angular.module("ive");

// Relationship connected_to create controller
app.controller("connectedToCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $relationshipService, $scenarioService, $locationService) {

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
            $scope.createRelationshipForm.start_location_id.$pristine = false;
            $scope.createRelationshipForm.end_location_id.$pristine = false;
            $scope.createRelationshipForm.weight.$pristine = false;
        } else {
            $scope.changeTab(0);
            $relationshipService.create('connected_to', $scope.relationship)
            .then(function onSuccess(response) {
                $scope.relationship = response.data;
                $scope.redirect("/relationship/connected_to/" + $scope.relationship.relationship_id);
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
                        $scope.changeTab(1);
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
    $scope.relationship = $relationshipService.init('connected_to');

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
