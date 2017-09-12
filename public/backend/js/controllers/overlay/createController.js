var app = angular.module("ive");

// Overlay create controller
app.controller("overlayCreateController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $overlayService) {

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
        if($scope.createOverlayForm.$invalid) {
            // Update UI
            $scope.createOverlayForm.name.$pristine = false;
            $scope.createOverlayForm.description.$pristine = false;
            $scope.createOverlayForm.category.$pristine = false;
            $scope.createOverlayForm.url.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_OVERLAY') };

            $overlayService.create($scope.overlay)
            .then(function onSuccess(response) {
                var new_overlay = response.data;
                $scope.redirect("/overlays/" + new_overlay.overlay_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.overlay = $overlayService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
