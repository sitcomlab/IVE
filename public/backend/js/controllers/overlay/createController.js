var app = angular.module("ive");

// Overlay create controller
app.controller("overlayCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $overlayService) {

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
            $scope.redirect("/overlays");
        }
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
            $scope.changeTab(0);
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
    $scope.changeTab(0);
    $scope.overlay = $overlayService.init();
    $scope.changeTab(1);

});
