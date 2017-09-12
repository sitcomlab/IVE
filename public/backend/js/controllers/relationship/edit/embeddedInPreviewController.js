var app = angular.module("ive");

// Relationship embedded_in edit in preview mode controller
app.controller("embeddedInEditPreviewController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $sce, $authenticationService, $relationshipService, $videoService) {

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
    $scope.save = function(){
        $scope.$parent.loading = { status: true, message: $filter('translate')('SAVING_RELATIONSHIP') };

        $relationshipService.edit($scope.relationship_label, $scope.relationship.relationship_id, $scope.relationship)
        .then(function onSuccess(response) {
            $scope.relationship = response.data;
            $scope.redirect("/edit/relationships/" + $scope.relationship_label + "/" + $scope.relationship.relationship_id);
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
        path = $window.location.origin + config.videoFolder + path;
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

    $scope.setOverlays = function(){
        var controlOn = true;
        var overlay_container = $( '#overlay-container' );
        var overlay_container_width = $( '#videogular-container' ).width();
        var overlay_container_height = $( '#videogular-container' ).height();
        var scene = new THREE.Scene();
        scene.add( new THREE.GridHelper( 1000, 10 ) );

        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        // Create renderer and allow transparent backgroun-color
        var renderer = new THREE.WebGLRenderer({
            alpha: true
        });

        renderer.setSize(overlay_container_width, overlay_container_height);
        // Set background color to transparent
        renderer.setClearColor(0xffffff, 0);
        overlay_container.append(renderer.domElement);



        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        var control;
        control = new THREE.TransformControls(camera, renderer.domElement);
        control.addEventListener('change', render );

        control.attach(cube);
        scene.add(control);

        window.addEventListener( 'keydown', function ( event ) {
            switch ( event.keyCode ) {
                case 67: // C
                    controlOn =! controlOn;
                    if(controlOn == true){
                        console.log("controlls on");
                        control = new THREE.TransformControls(camera, renderer.domElement);
                        control.addEventListener('change', render );

                        control.attach(cube);
                        scene.add(control);
                    }
                    else{
                        console.log("controlls off");
                        scene.remove(control);
                    }
            }
        });



        window.addEventListener( 'keydown', function ( event ) {
            switch (event.keyCode) {
                case 81: // Q
                    control.setSpace(control.space === "local" ? "world" : "local");
                    break;
                case 17: // Ctrl
                    control.setTranslationSnap(100);
                    control.setRotationSnap(THREE.Math.degToRad(15));
                    break;
                case 84: // T
                    control.setMode("translate");
                    break;
                case 82: // R
                    control.setMode("rotate");
                    break;
                case 68: // D
                    control.setMode("scale");
                    break;
                case 83: // S
                    control.setMode("scale");
                    break;
                case 187:
                case 107: // +, =, num+
                    control.setSize(control.size + 0.1);
                    break;
                case 189:
                case 109: // -, _, num-
                    control.setSize(Math.max(control.size - 0.1, 0.1));
                    break;
            }
        });

        window.addEventListener( 'keyup', function ( event ) {
            switch ( event.keyCode ) {
                case 17: // Ctrl
                    control.setTranslationSnap( null );
                    control.setRotationSnap( null );
                    break;
            }
        });

        camera.position.z = 5;

        var render = function () {
            control.update();
            requestAnimationFrame( render );

            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;

            renderer.render(scene, camera);
        };

        render();

    }



    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    $scope.relationship_label = 'embedded_in';

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
    console.log("starting retrieve_by_id")
    $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id)
    .then(function onSuccess(response) {
        console.log(response);
        $scope.relationship = response.data;
        console.log($scope.relationship)

        $scope.changeSource($scope.relationship.video_url)

        setTimeout(function(){ $scope.setOverlays(); }, 5000);

        console.log("changed scope")

        $scope.$parent.loading = { status: false, message: "" };


    })
    .catch(function onError(response) {
        console.log(response);
        $window.alert(response.data);
    });

});
