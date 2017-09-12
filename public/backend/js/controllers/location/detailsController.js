var app = angular.module("ive");

// Location details controller
app.controller("locationDetailsController", function($scope, $rootScope, $routeParams, $interval, $filter, $translate, $location, config, $window, $authenticationService, $locationService, $videoService, $overlayService) {

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
     * [toggle description]
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.toggle = function(item){
        switch (item) {
            case 'relatedLocations': {
                $scope.relatedLocations = !$scope.relatedLocations;
                break;
            }
            case 'relatedVideos': {
                $scope.relatedVideos = !$scope.relatedVideos;
                break;
            }
        }
    };


    /**
     * [startPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.startPreview = function(video) {
        // store the interval promise
        $scope.currentPreview = 1;
        $scope.maxPreview = video.thumbnails;

        // stops any running interval to avoid two intervals running at the same time
        $interval.cancel(promise);

        // store the interval promise
        promise = $interval(function() {
            var index = $scope.location.videos.indexOf(video);
            if($scope.location.videos[index].thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.location.videos[index].thumbnail = $filter('thumbnail')($scope.location.videos[index], $scope.currentPreview);
            }
            $scope.currentPreview++;
        }, config.thumbnailSpeed);
    };

    /**
     * [stopPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.stopPreview = function(video) {
        $interval.cancel(promise);
    };

    /**
     * [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.load = function(data){
        switch (data) {
            case 'location': {
                $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_LOCATION') };

                // Load location
                $locationService.retrieve($routeParams.location_id)
                .then(function onSuccess(response) {
                    $scope.location = response.data;
                    $scope.load("locations");
                })
                .catch(function onError(response) {
                    $window.alert(response.data);
                    $scope.load();
                });
                break;
            }
            case 'locations': {
                $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATED_LOCATIONS') };

                // Load connected locations
                $locationService.list_by_location($scope.location.location_id)
                .then(function onSuccess(response) {
                    $scope.location.connected_locations = response.data;
                    $scope.load("videos");
                })
                .catch(function onError(response) {
                    $window.alert(response.data);
                    $scope.load();
                });
                break;
            }
            case 'videos': {
                $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATED_VIDEOS') };

                // Load related videos
                $videoService.list_by_location($scope.location.location_id)
                .then(function onSuccess(response) {
                    $scope.location.videos = response.data;
                    $scope.load();
                })
                .catch(function onError(response) {
                    $window.alert(response.data);
                    $scope.load();
                });
                break;
            }
            default: {
                $scope.$parent.loading = { status: false, message: "" };
            }
        }
    };



    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_LOCATION') };
    $scope.relatedLocations = true;
    $scope.relatedVideos = true;
    var promise;

    // Load location and related data
    $scope.load("location");

});
