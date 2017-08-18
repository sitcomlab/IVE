var app = angular.module("ive");

// Video create controller
app.controller("videoCreateController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $videoService) {

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
        if($scope.createVideoForm.$invalid) {
            // Update UI
            $scope.createVideoForm.name.$pristine = false;
            $scope.createVideoForm.description.$pristine = false;
            $scope.createVideoForm.url.$pristine = false;
            $scope.createVideoForm.recorded.$pristine = false;
            $scope.createVideoForm.thumbnails.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_VIDEO') };

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
    $scope.video = $videoService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
