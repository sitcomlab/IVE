var app = angular.module("ive");

// Video create controller
app.controller("videoCreateController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $videoService) {

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
            $scope.redirect("/videos");
        } else {
            $scope.redirect("/videos");
        }
    };

    /**
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.createVideoForm.$invalid) {
            // Update UI
            $scope.createVideoForm.name.$pristine = false;
            $scope.createVideoForm.description.$pristine = false;
            $scope.createVideoForm.url.$pristine = false;
            $scope.createVideoForm.recorded.$pristine = false;
        } else {
            $scope.changeTab(0);
            $videoService.create($scope.video)
            .then(function onSuccess(response) {
                var new_video = response.data;
                $scope.redirect("/videos/" + new_video.video_id);
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
    $scope.video = $videoService.init();
    $scope.changeTab(1);

});
