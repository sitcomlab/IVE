var app = angular.module("ive");

// Video delete controller
app.controller("videoDeleteController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $videoService) {

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
     * [delete description]
     * @return {[type]} [description]
     */
    $scope.delete = function(){
        $scope.changeTab(0);
        $videoService.remove($scope.video.video_id)
        .then(function onSuccess(response) {
            $scope.redirect("/videos");
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);
    $scope.input = "";

    // Load video
    $videoService.retrieve($routeParams.video_id)
    .then(function onSuccess(response) {
        $scope.video = response.data;
        $scope.changeTab(1);
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
