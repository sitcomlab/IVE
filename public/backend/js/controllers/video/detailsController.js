var app = angular.module("ive");

// Video details controller
app.controller("videoDetailsController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $videoService, $overlayService) {

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


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);

    // Load video
    $videoService.retrieve($routeParams.video_id)
    .then(function onSuccess(response) {
        $scope.video = response.data;
        $scope.changeTab(1);

        // Load related overlays
        /*$overlayService.list_by_scenario($scope.video.video_id)
        .then(function onSuccess(response) {
            $scope.video.overlays = response.data;
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });*/

    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
