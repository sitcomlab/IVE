var app = angular.module("ive");

// Relationship embedded_in edit in preview mode controller
app.controller("embeddedInEditPreviewController", function($scope, $rootScope, $routeParams, $translate, $location, config, $window, $sce, $authenticationService, $relationshipService, $videoService) {

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
        $scope.changeTab(0);
        $relationshipService.edit('embedded_in', $scope.relationship.relationship_id, $scope.relationship)
        .then(function onSuccess(response) {
            $scope.relationship = response.data;
            $scope.redirect("/relationship/embedded_in/" + $scope.relationship.relationship_id + "/edit");
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    };


    /**
     * [changeSource description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.changeSource = function(path) {
        console.log($window.location.origin);
        console.log(path);
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


    /*************************************************
        INIT
     *************************************************/
    $scope.changeTab(0);

    // Videoplayer
    $scope.videoConfig = {
        loop: true,
        theme: "../bower_components/videogular-themes-default/videogular.css",
        autoHide: true,
        autoHideTime: 100,
        autoPlay: true
    };
    $scope.sources = [];

    // Load relationship
    $relationshipService.retrieve_by_id('embedded_in', $routeParams.relationship_id)
    .then(function onSuccess(response) {
        $scope.relationship = response.data;
        console.log($scope.relationship);

        $scope.changeSource($scope.relationship.video_url);

        $scope.changeTab(1);

    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });

});
