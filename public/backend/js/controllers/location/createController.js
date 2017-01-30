var app = angular.module("ive");

// Location create controller
app.controller("locationCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $locationService) {

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
            $scope.redirect("/locations");
        } else {
            $scope.redirect("/locations");
        }
    };

    /**
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.createLocationForm.$invalid) {
            // Update UI
            $scope.createLocationForm.name.$pristine = false;
            $scope.createLocationForm.description.$pristine = false;
            $scope.createLocationForm.location_type.$pristine = false;
            $scope.createLocationForm.lng.$pristine = false;
            $scope.createLocationForm.lat.$pristine = false;
        } else {
            $scope.changeTab(0);
            $locationService.create($scope.location)
            .then(function onSuccess(response) {
                var new_location = response.data;
                $scope.redirect("/locations/" + new_location.location_id);
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
    $scope.location = $locationService.init();
    $scope.changeTab(1);

});
