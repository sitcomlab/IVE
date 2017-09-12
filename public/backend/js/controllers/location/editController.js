var app = angular.module("ive");

// Location edit controller
app.controller("locationEditController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $locationService) {

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
        if($scope.editLocationForm.$invalid) {
            // Update UI
            $scope.editLocationForm.name.$pristine = false;
            $scope.editLocationForm.description.$pristine = false;
            $scope.editLocationForm.location_type.$pristine = false;
            $scope.editLocationForm.lng.$pristine = false;
            $scope.editLocationForm.lat.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('SAVING_LOCATION') };

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
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_LOCATION') };

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
