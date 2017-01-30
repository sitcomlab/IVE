var app = angular.module("ive");

// Location edit controller
app.controller("locationEditController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $locationService) {

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
            $scope.redirect("/locations/" + $scope.location.location_id);
        }
    };

    /**
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.editLocationForm.$invalid) {
            // Update UI
            $scope.editLocationForm.name.$pristine = false;
            $scope.editLocationForm.description.$pristine = false;
            $scope.editLocationForm.location_type.$pristine = false;
            $scope.editLocationForm.lng.$pristine = false;
            $scope.editLocationForm.lat.$pristine = false;
        } else {
            $scope.changeTab(0);
            $locationService.edit($scope.location.location_id, $scope.location)
            .then(function onSuccess(response) {
                $scope.location = response.data;
                $scope.redirect("/locations/" + $scope.location.location_id);
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

    // Load location
    $locationService.retrieve($routeParams.location_id)
    .then(function onSuccess(response) {
        $scope.location = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
