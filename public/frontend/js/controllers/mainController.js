var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, $window, config, $routeParams, $filter, $location, $translate, $videoService, $sce, $socket) {

    // Init
    $scope.current = {
        scenarioStatus: false,
        locationStatus: false,
        videoStatus: false
    };
    $scope.controls = true; // Hide videoplayer controls
    $scope.sources = [ // Video URLs
        {
            src: $sce.trustAsResourceUrl("localhost:4000/media/videos/city_center/task01.mp4"),
        type: "video/mp4"
        }/*, {
            src: $sce.trustAsResourceUrl("path/to/video/source.webm"),
            type: "video/webm"
        }, {
            src: $sce.trustAsResourceUrl("path/to/video/source.ogg"),
            type: "video/ogg"
        }*/
    ];


    /**
     * [changeSource description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.changeSource = function(path) {
        path = $window.location.origin + path;
        $scope.sources = [{
                src: $sce.trustAsResourceUrl(path + ".mp4"),
                type: "video/mp4"
            }, {
                src: $sce.trustAsResourceUrl(path + ".webm"),
                type: "video/webm"
            }, {
                src: $sce.trustAsResourceUrl(path + ".ogg"),
                type: "video/ogg"
            }
        ];
    };


    /**
     * [scenario description]
     * @type {String}
     */
    $socket.on('/set/scenario', function(data) {
        console.log(new Date() + " /set/scenario: " + data.scenario_id);
        $scope.current = {
            scenarioStatus: true,
            locationStatus: false,
            videoStatus: false
        };
    });

    /**
     * [location description]
     * @type {String}
     */
    $socket.on('/set/location', function(data) {
        console.log(new Date() + " /set/location: " + data.location_id);
        $scope.current = {
            scenarioStatus: true,
            locationStatus: true,
            videoStatus: false
        };
    });

    /**
     * [video description]
     * @type {String}
     */
    $socket.on('/set/video', function(data) {
        console.log(new Date() + " /set/video: " + data.video_id);
        $scope.current = {
            scenarioStatus: true,
            locationStatus: true,
            videoStatus: true
        };

        // Request video data
        $videoService.get(data.video_id).success(function(response) {
            $scope.current.video = response;
            //$scope.changeSource($scope.current.video.url);
        }).error(function(err) {
            $scope.err = err;
        });
    });

    /**
     * [controls description]
     * @type {String}
     */
    $socket.on('/toggle/controls', function(data) {
        console.log(new Date() + " /toggle/controls: " + data.status);
        $scope.controls = data.status;
    });

});
