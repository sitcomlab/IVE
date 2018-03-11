var app = angular.module("ive");

// Scenario details controller
app.controller("scenarioDetailsController", function($scope, $rootScope, $routeParams, $interval, $filter, $translate, $location, config, $window, $authenticationService, $scenarioService, $locationService, $videoService, $overlayService) {

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
            case 'relatedOverlays': {
                $scope.relatedOverlays = !$scope.relatedOverlays;
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
            var index = $scope.scenario.videos.indexOf(video);
            if($scope.scenario.videos[index].thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.scenario.videos[index].thumbnail = $filter('thumbnail')($scope.scenario.videos[index], $scope.currentPreview);
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
            case 'scenario': {
                $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_SCENARIO') };

                // Load scenario
                $scenarioService.retrieve($routeParams.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.scenario = response.data;
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

                // Load related locations
                $locationService.list_by_scenario($scope.scenario.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.scenario.locations = response.data;
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
                $videoService.list_by_scenario($scope.scenario.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.scenario.videos = response.data;
                        $scope.load("overlays");
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                        $scope.load();
                    });
                break;
            }
            case 'overlays': {
                $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATED_OVERLAYS') };

                // Load related overlays
                $overlayService.list_by_scenario($scope.scenario.scenario_id)
                    .then(function onSuccess(response) {
                        $scope.scenario.overlays = response.data;
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
        LISTENERS
     *************************************************/
    $scope.$on('$destroy', function() {
        $interval.cancel(promise);
    });


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_SCENARIO') };
    var promise;

    $scope.relatedLocations = true;
    $scope.relatedVideos = true;
    $scope.relatedOverlays = true;

    // Load scenario and related data
    $scope.load("scenario");

});
