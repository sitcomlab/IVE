var app = angular.module("ive");

// Video edit controller
app.controller("videoEditController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $authenticationService, $videoService) {

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
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.editVideoForm.$invalid) {
            // Update UI
            $scope.editVideoForm.name.$pristine = false;
            $scope.editVideoForm.description.$pristine = false;
            $scope.editVideoForm.url.$pristine = false;
            $scope.editVideoForm.recorded.$pristine = false;
        } else {
            $scope.changeTab(0);
            $videoService.edit($scope.video.video_id, $scope.video)
            .then(function onSuccess(response) {
                $scope.video = response.data;
                $scope.redirect("/videos/" + $scope.video.video_id);
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
