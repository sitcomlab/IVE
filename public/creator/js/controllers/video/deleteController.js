var app = angular.module("ive");

// Video delete controller
app.controller("videoDeleteController", function($http, $scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $videoService) {

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
     * [delete description]
     * @return {[type]} [description]
     */
    $scope.delete = function(){
        $scope.$parent.loading = { status: true, message: $filter('translate')('DELETING_VIDEO') };

        $videoService.remove($scope.video.video_id)
        .then(function onSuccess(response) {
            $scope.redirect("/videos");
        })
        .catch(function onError(response) {
            if (response.data == "Token expired!") {
                $http.post(config.getApiEndpoint() + "/refreshToken", { refresh: $authenticationService.getRefreshToken() })
                .then(res => { 
                    $authenticationService.updateUser(res.data);
                    $videoService.remove($scope.video.video_id)
                    .then(function onSuccess(response) {
                        $scope.redirect("/videos");
                    })
                    .catch(function onError(response) {
                        if (response.status > 0) {
                            $window.alert(response.data);
                        }
                    });
                })
            } else {
                $window.alert(response.data);
            }
        });
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_VIDEO') };
    $scope.input = "";

    // Load video
    $videoService.retrieve($routeParams.video_id)
    .then(function onSuccess(response) {
        $scope.video = response.data;
        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
