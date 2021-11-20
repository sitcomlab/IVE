var app = angular.module("ive");

// Overlay edit controller
app.controller("overlayEditController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $overlayService) {

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
        if($scope.editOverlayForm.$invalid) {
            // Update UI
            $scope.editOverlayForm.name.$pristine = false;
            $scope.editOverlayForm.description.$pristine = false;
            $scope.editOverlayForm.category.$pristine = false;
            $scope.editOverlayForm.url.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('SAVING_OVERLAY') };

            $overlayService.edit($scope.overlay.overlay_id, $scope.overlay)
            .then(function onSuccess(response) {
                $scope.overlay = response.data;
                $scope.redirect("/overlays/" + $scope.overlay.overlay_id);
            })
            .catch(function onError(response) {
                if (response.data == "Token expired!") {
                    $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                    .then(res => { 
                        $authenticationService.updateUser(res.data);
                        $overlayService.edit($scope.overlay.overlay_id, $scope.overlay)
                        .then(function onSuccess(response) {
                            $scope.overlay = response.data;
                            $scope.redirect("/overlays/" + $scope.overlay.overlay_id);
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
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_OVERLAY') };

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
