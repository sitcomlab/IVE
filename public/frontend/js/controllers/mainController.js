var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, $window, config, $routeParams, $filter, $location, $translate, $videoService, $sce, $socket) {


    // Init
    $scope.videoConfig = {
        loop: true,
        theme: "../bower_components/videogular-themes-default/videogular.css",
        autoHide: true,
		autoHideTime: 100,
		autoPlay: true
    };
    $scope.sources = [];
    $scope.current = {
        scenarioStatus: false,
        locationStatus: false,
        videoStatus: false
    };
    

    /**
     * [changeSource description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.changeSource = function(path) {
        path = $window.location.origin + path;
        $scope.sources = [];
        $scope.sources.push({
            src: $sce.trustAsResourceUrl(path + ".mp4"),
            type: "video/mp4"
        }, {
            src: $sce.trustAsResourceUrl(path + ".ogg"),
            type: "video/ogg"
        });
        /*{
            src: $sce.trustAsResourceUrl(path + ".webm"),
            type: "video/webm"
        }*/
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

        // Request related video data automatically
        $videoService.list_by_location(data.location_id).success(function(response) {
            for(var i=0; i<response.length; i++){
                if(response[i].preferred){
                    $scope.current.videoStatus = true;
                    $scope.current.video = response[i];
                    $scope.changeSource($scope.current.video.url);
                }
            }
            if($scope.current.video === undefined && response.length > 0){
                console.log("No preferred video found");
                $scope.current.videoStatus = true;
                $scope.current.video = response[0];
            } else {
                console.log("No videos found");
            }
        }).error(function(err) {
            $scope.err = err;
        });
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
            for(var i=0; i<response.length; i++){
                if(response[i].preferred){
                    $scope.current.video = response[i];
                    $scope.changeSource($scope.current.video.url);
                }
            }
            if($scope.current.video === undefined && response.length > 0){
                console.log("No preferred video found");
                $scope.current.video = response[0];
            } else {
                console.log("No videos found");
            }
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
