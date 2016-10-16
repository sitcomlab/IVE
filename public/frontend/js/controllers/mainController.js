var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, config, $routeParams, $filter, $location, $translate, $videoService, $sce) {

    // Init
    $scope.current = {
        scenarioStatus: false,
        locationStatus: false,
        videoStatus: false
    };
    $scope.controls = false;


    $scope.sources = [{
        src: $sce.trustAsResourceUrl("path/to/video/source.mp4"),
        type: "video/mp4"
    }, {
        src: $sce.trustAsResourceUrl("path/to/video/source.webm"),
        type: "video/webm"
    }, {
        src: $sce.trustAsResourceUrl("path/to/video/source.ogg"),
        type: "video/ogg"
    }];


    /**
     * [changeSource description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.changeSource = function(path) {
        $scope.sources = [{
            src: $sce.trustAsResourceUrl("path/to/another-video/source.mp4"),
            type: "video/mp4"
        }, {
            src: $sce.trustAsResourceUrl("path/to/another-video/source.webm"),
            type: "video/webm"
        }, {
            src: $sce.trustAsResourceUrl("path/to/another-video/source.ogg"),
            type: "video/ogg"
        }];
    };

    // TODO: On change (Sockets)
    /*$videoService.get($scope.currentVideo.video_id).success(function(response) {
        $scope.currentVideo = response;
    }).error(function(err) {
        $scope.err = err;
    });*/

});
