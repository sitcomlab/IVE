var app = angular.module("ive");

// Video details controller
app.controller("videoDetailsController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $locationService, $videoService, $overlayService) {

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
            $scope.redirect("/");
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);

    // Load video
    $locationService.retrieve($routeParams.location_id)
    .then(function onSuccess(response) {
        $scope.video = response.data;
        $scope.changeTab(1);

        // Load related locations
        $locationService.list_by_location($scope.location.location_id)
        .then(function onSuccess(response) {
            $scope.location.related_locations = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

        // Load related videos
        $videoService.list_by_location($scope.location.location_id)
        .then(function onSuccess(response) {
            $scope.location.videos = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
