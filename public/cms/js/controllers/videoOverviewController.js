var app = angular.module("ive_cms");

app.controller("videoOverviewController", function ($scope, $rootScope, $window, config, $videoService, $location, $authenticationService, $relationshipService, $filter, $interval) {

    // $scope.active = "videos";
    $scope.subsite = "overview";
    $scope.portraitView = true;

    var promise;

    $rootScope.currentCategory = "Videos";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/videos');
    }
    $rootScope.currentSite = null;

    // Authenticate with the creator to get permissions to delete content

    $authenticationService.authenticate(config.creatorLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });


    $videoService.list()
        .then(function onSuccess(response) {
            $scope.videos = response.data;
        });

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    $scope.deleteVideo = function (video_id) {

        if ($window.confirm(`You are going to delete the Video. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {

                $videoService.remove(video_id).then(function (response) {
                    console.log('Video removed');
                });
                // Delete the video from the videos array
                $scope.videos.forEach(function (video, index) {

                    if (video.video_id == video_id) {
                        $scope.videos.splice(index, 1);
                    }

                }, this);

                // Delete relation to location
                $relationshipService.list_by_type('recorded_at').then(function (relations) {
                    relations.data.forEach(function (relation) {
                        if (relation.video_id == video_id) {
                            $relationshipService.remove(relation.relationship_id);
                        }
                    }, this);
                })

            }
        }

    };

    $scope.search = function () {
        $videoService.list()
            .then(function onSuccess(response) {
                var allVideos = response.data;
                var searchResults = [];
                if ($scope.searchTerm != null && $scope.searchTerm != "") {
                    var normalized = $scope.searchTerm.toLowerCase();
                    for (var i = 0; i < $scope.videos.length; i++) {
                        var match = false;
                        var current_video = $scope.videos[i];
                        if (current_video.name.toLowerCase().search('(' + normalized + ')') != -1) match = true;
                        if (current_video.description.toLowerCase().search('(' + normalized + ')') != -1) match = true;
                        if (match) searchResults.push(current_video);
                    }
                    $scope.videos = searchResults;
                } else {
                    $scope.videos = allVideos;
                }
            })
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


});