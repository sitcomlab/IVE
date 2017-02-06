var app = angular.module("ive");

// Scenario delete controller
app.controller("scenarioDeleteController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $scenarioService) {

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
     * [delete description]
     * @return {[type]} [description]
     */
    $scope.delete = function(){
        $scope.changeTab(0);
        $scenarioService.remove($scope.scenario.scenario_id)
        .then(function onSuccess(response) {
            $scope.redirect("/scenarios");
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.input = "";

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
