var app = angular.module("ive");

// Scenario edit controller
app.controller("scenarioEditController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $scenarioService) {

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
            $scope.$parent.loading = { status: true, message: $filter('translate')('SAVING_SCENARIO') };

            $scenarioService.edit($scope.scenario.scenario_id, $scope.scenario)
            .then(function onSuccess(response) {
                $scope.scenario = response.data;
                $scope.redirect("/scenarios/" + $scope.scenario.scenario_id);
            })
            .catch(function onError(response) {
                if (response.data == "Token expired!") {
                    $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                    .then(res => { 
                        $authenticationService.updateUser(res.data);
                        $scenarioService.edit($scope.scenario.scenario_id, $scope.scenario)
                        .then(function onSuccess(response) {
                            $scope.scenario = response.data;
                            $scope.redirect("/scenarios/" + $scope.scenario.scenario_id);
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
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_SCENARIO') };

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
