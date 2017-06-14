var app = angular.module("ive");

// Scenario edit controller
app.controller("scenarioEditController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $scenarioService) {

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
        if($scope.editScenarioForm.$invalid) {
            // Update UI
            $scope.editScenarioForm.name.$pristine = false;
            $scope.editScenarioForm.description.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: "SAVING_SCENARIO" };

            $scenarioService.edit($scope.scenario.scenario_id, $scope.scenario)
            .then(function onSuccess(response) {
                $scope.scenario = response.data;
                $scope.redirect("/scenarios/" + $scope.scenario.scenario_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: "LOADING_SCENARIO" };

    // Load scenario
    $scenarioService.retrieve($routeParams.scenario_id)
    .then(function onSuccess(response) {
        $scope.scenario = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
