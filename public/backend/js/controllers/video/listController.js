var app = angular.module("ive");


// Video list controller
app.controller("videoListController", function($scope, $rootScope, $interval, $filter, $translate, $location, config, $window, $authenticationService, $videoService) {

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
            var index = $scope.videos.indexOf(video);
            if($scope.videos[index].thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.videos[index].thumbnail = $filter('thumbnail')($scope.videos[index], $scope.currentPreview);
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
     * @return {[type]} [description]
     */
    $scope.load = function(){
        // Check for a search-text
        if($scope.filter.search_term !== ""){
            // Search videos
            $videoService.search($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.videos = response.data;
                $scope.pages = [];

                // Prepare pagination
                if($scope.videos.length > 0){
                    // Set count
                    $videoService.setCount($scope.videos[0].full_count);
                } else {
                    // Reset count
                    $videoService.setCount(0);

                    // Reset pagination
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                for(var i=0; i<Math.ceil($videoService.getCount() / $scope.pagination.limit); i++){
                    $scope.pages.push({
                        offset: i * $scope.pagination.limit
                    });
                }

                $scope.$parent.loading = { status: false, message: "" };
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        } else {
            // Load videos
            $videoService.list($scope.pagination, $scope.filter)
            .then(function onSuccess(response) {
                $scope.videos = response.data;
                $scope.pages = [];

                // Prepare pagination
                if($scope.videos.length > 0){
                    // Set count
                    $videoService.setCount($scope.videos[0].full_count);
                } else {
                    // Reset count
                    $videoService.setCount(0);

                    // Reset pagination
                    $scope.pagination.offset = 0;
                }

                // Set pagination
                for(var i=0; i<Math.ceil($videoService.getCount() / $scope.pagination.limit); i++){
                    $scope.pages.push({
                        offset: i * $scope.pagination.limit
                    });
                }

                $scope.$parent.loading = { status: false, message: "" };
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };

    /**
     * [resetSearch description]
     */
    $scope.resetSearch = function(){
        $scope.filter.search_term = "";
        $scope.applyFilter();
    };

    /**
     * [applyFilter description]
     * @return {[type]} [description]
     */
    $scope.applyFilter = function(){
        $videoService.setFilter($scope.filter);
        $scope.load();
    };

    /**
     * [description]
     * @param  {[type]} offset [description]
     * @return {[type]}        [description]
     */
    $scope.changeOffset = function(offset, page_index){
        $scope.pagination.offset = offset;
        $videoService.setPagination($scope.pagination);
        $scope.load();
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
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_VIDEOS') };
    var promise;

    // Load videos
    $scope.pagination = $videoService.getPagination();
    $scope.filter = $videoService.getFilter();
    $scope.applyFilter();

});
