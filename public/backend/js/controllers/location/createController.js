var app = angular.module("ive");

// Location create controller
app.controller("locationCreateController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $locationService) {

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
        if($scope.createLocationForm.$invalid) {
            // Update UI
            $scope.createLocationForm.name.$pristine = false;
            $scope.createLocationForm.description.$pristine = false;
            $scope.createLocationForm.location_type.$pristine = false;
            $scope.createLocationForm.lng.$pristine = false;
            $scope.createLocationForm.lat.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_LOCATION') };

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
    $scope.location = $locationService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
