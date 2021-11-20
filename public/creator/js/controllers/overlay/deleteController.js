var app = angular.module("ive");

// Overlay delete controller
app.controller("overlayDeleteController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $overlayService) {

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
        $scope.$parent.loading = { status: true, message: $filter('translate')('DELETING_OVERLAY') };

        $overlayService.remove($scope.overlay.overlay_id)
        .then(function onSuccess(response) {
            $scope.redirect("/overlays");
        })
        .catch(function onError(response) {
            if (response.data == "Token expired!") {
                $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                .then(res => { 
                    $authenticationService.updateUser(res.data);
                    $overlayService.remove($scope.overlay.overlay_id)
                    .then(function onSuccess(response) {
                        $scope.redirect("/overlays");
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
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_OVERLAY') };
    $scope.input = "";

    // Load overlay
    $overlayService.retrieve($routeParams.overlay_id)
    .then(function onSuccess(response) {
        $scope.overlay = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
