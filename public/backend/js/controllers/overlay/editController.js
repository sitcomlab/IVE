var app = angular.module("ive");

// Overlay edit controller
app.controller("overlayEditController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $overlayService) {

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
            $scope.redirect("/overlays");
        } else {
            $scope.redirect("/overlays/" + $scope.overlay.overlay_id);
        }
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
            $scope.changeTab(0);
            $overlayService.edit($scope.overlay.overlay_id, $scope.overlay)
            .then(function onSuccess(response) {
                $scope.overlay = response.data;
                $scope.redirect("/overlays/" + $scope.overlay.overlay_id);
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

    // Load overlay
    $overlayService.retrieve($routeParams.overlay_id)
    .then(function onSuccess(response) {
        $scope.overlay = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
