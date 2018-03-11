var app = angular.module("ive");

// Video details controller
app.controller("videoDetailsController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $videoService, $overlayService) {

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


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_VIDEO') };

    // Load video
    $videoService.retrieve($routeParams.video_id)
    .then(function onSuccess(response) {
        $scope.video = response.data;
        $scope.$parent.loading = { status: false, message: "" };

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
