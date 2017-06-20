var app = angular.module("ive");

// Relationship embedded_in edit in preview mode controller
app.controller("embeddedInEditPreviewController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $sce, $authenticationService, $relationshipService, $videoService, tjsModelViewer) {

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
        $scope.$parent.loading = { status: true, message: $filter('translate')('') };
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
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };

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

        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });



    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    var render = function () {
        requestAnimationFrame( render );

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;

        renderer.render(scene, camera);
    };

    render();

});
