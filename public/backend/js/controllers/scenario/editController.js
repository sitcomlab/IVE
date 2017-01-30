var app = angular.module("ive");

// Scenario edit controller
app.controller("scenarioEditController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $scenarioService) {

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
     * [cancel description]
     * @return {[type]} [description]
     */
    $scope.cancel = function(){
        if($authenticationService.get()){
            $scope.redirect("/scenarios");
        } else {
            $scope.redirect("/scenarios/" + $scope.scenario.scenario_id);
        }
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
            $scope.changeTab(0);
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
    $scope.changeTab(0);

    // Load scenario
    $scenarioService.retrieve($routeParams.scenario_id)
    .then(function onSuccess(response) {
        $scope.scenario = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
