var app = angular.module("ive");

// Scenario create controller
app.controller("scenarioCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $scenarioService) {

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
        if($scope.createScenarioForm.$invalid) {
            // Update UI
            $scope.createScenarioForm.name.$pristine = false;
            $scope.createScenarioForm.description.$pristine = false;
        } else {
            $scope.changeTab(0);
            $scenarioService.create($scope.scenario)
            .then(function onSuccess(response) {
                var new_scenario = response.data;
                $scope.redirect("/scenarios/" + new_scenario.scenario_id);
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
    $scope.scenario = $scenarioService.init();
    $scope.changeTab(1);

});
