var app = angular.module("ive");

// Scenario create controller
app.controller("scenarioCreateController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $scenarioService) {

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
        if($scope.createScenarioForm.$invalid) {
            // Update UI
            $scope.createScenarioForm.name.$pristine = false;
            $scope.createScenarioForm.description.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message:  $filter('translate')('CREATING_SCENARIO') };

            $scenarioService.create($scope.scenario)
            .then(function onSuccess(response) {
                var new_scenario = response.data;
                $scope.redirect("/scenarios/" + new_scenario.scenario_id);
            })
            .catch(function onError(response) {
                if (response.data == "Token expired!") {
                    $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                    .then(res => { 
                        $authenticationService.updateUser(res.data);
                        $scenarioService.create($scope.scenario)
                        .then(function onSuccess(response) {
                            var new_scenario = response.data;
                            $scope.redirect("/scenarios/" + new_scenario.scenario_id);
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


    /*************************************************
        INIT
     *************************************************/
    $scope.scenario = $scenarioService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
