var app = angular.module("ive");

// Location delete controller
app.controller("locationDeleteController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $locationService) {

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
     * [delete description]
     * @return {[type]} [description]
     */
    $scope.delete = function(){
        $scope.$parent.loading = { status: true, message: $filter('translate')('DELETING_LOCATION') };

        $locationService.remove($scope.location.location_id)
        .then(function onSuccess(response) {
            $scope.redirect("/locations");
        })
        .catch(function onError(response) {
            if (response.data == "Token expired!") {
                $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                .then(res => { 
                    $authenticationService.updateUser(res.data);
                    $locationService.remove($scope.location.location_id)
                    .then(function onSuccess(response) {
                        $scope.redirect("/locations");
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
    };

    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_LOCATION') };
    $scope.input = "";

    // Load location
    $locationService.retrieve($routeParams.location_id)
    .then(function onSuccess(response) {
        $scope.location = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
