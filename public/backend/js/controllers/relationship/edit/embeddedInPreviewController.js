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
     * [save description]
     * @return {[type]} [description]
     */
    $scope.save = function(){
        // Getting the values of position, rotation and size
        $scope.scene.updateMatrixWorld(true);
        var position = new THREE.Vector3();
        position.getPositionFromMatrix( $scope.object.matrixWorld );
        var rotation = new THREE.Euler();
        $scope.object.getWorldRotation(rotation);
        var size = new THREE.Box3().setFromObject($scope.object);
        console.log(position.x + ',' + position.y + ',' + position.z);
        console.log(rotation.x + ',' + rotation.y + ',' + rotation.z);
        var x = (size.max.x - size.min.x) / 0.036;
        var y = (size.max.y - size.min.y) / 0.036;
        var z = (size.max.z - size.min.z) / 0.036;
        console.log(x, y, z);
        $scope.relationship.relationship_w = x;
        $scope.relationship.relationship_h = y;
        $scope.relationship.relationship_d = z;
        $scope.relationship.relationship_x = position.x;
        $scope.relationship.relationship_y = position.y;
        $scope.relationship.relationship_z = position.z;
        $scope.relationship.relationship_rx = rotation.x;
        $scope.relationship.relationship_ry = rotation.y;
        $scope.relationship.relationship_rz = rotation.z;
        $scope.$parent.loading = { status: true, message: $filter('translate')('SAVING_RELATIONSHIP') };

        $relationshipService.edit($scope.relationship_label, $scope.relationship.relationship_id, $scope.relationship)
            .then(function onSuccess(response) {
                console.log(response.data);
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
        pathMp4 = path + ".mp4";
        pathOgg = path + ".ogg";
        console.log(pathMp4);
        $("#video").find("#srcmp4").attr("src", pathMp4)
        $("#video").find("#srcogg").attr("src", pathOgg)
        $("#video-container video")[0].load();
    };

    // loading the overlay, set the controls
    $scope.setOverlays = function(){
        // Getting the right size
        var controlOn = true;
        var overlay_container = $( '#overlay-container' );
        var overlay_container_width = $( '#video-container' ).width();
        var overlay_container_height = $( '#video-container' ).height();

        // Creating the camera
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        // Creating the scene
        $scope.scene = new THREE.Scene();
        $scope.scene.add( new THREE.GridHelper( 1000, 10 ) );

        // Make sure that Three.js uses CORS to load external urls as textures, for example.
        THREE.ImageUtils.crossOrigin = '';
        var control;

        // if overlay is an website
        if($scope.relationship.overlay_category == "website"){
            // Creating the cssRenderer
            var cssRenderer = new THREE.CSS3DRenderer({
                alpha: true
            });
            cssRenderer.setSize(overlay_container_width, overlay_container_height);
            cssRenderer.setClearColor(0xffffff, 0);
            cssRenderer.domElement.style.position = 'absolute';
            overlay_container.append(cssRenderer.domElement);

            var element = document.createElement('iframe');
            element.src = $scope.relationship.overlay_url;
            element.style.width = parseInt($scope.relationship.relationship_w, 10) + 'px';
            element.style.height = parseInt($scope.relationship.relationship_h, 10) + 'px';
            element.style.border = '0px';

            $scope.object = new THREE.CSS3DObject(element);

            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseInt($scope.relationship.relationship_x, 10);
            $scope.object.position.y = parseInt($scope.relationship.relationship_y, 10);
            $scope.object.position.z = parseInt($scope.relationship.relationship_z, 10);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.object.scale.x = 0.036; //FIXME: iframe is shown too big, number is used to minimize it
            $scope.object.scale.y = 0.036; //FIXME: iframe is shown too big, number is used to minimize it
            $scope.scene.add($scope.object);

            control = new THREE.TransformControls(camera, cssRenderer.domElement);
            control.addEventListener('change', render );

            control.attach($scope.object);
            $scope.scene.add(control);
        }

        // if overlay is an image
        if($scope.relationship.overlay_category == "picture"){
            // Create renderer and allow transparent backgroun-color
            var renderer = new THREE.WebGLRenderer({
                alpha: true
            });
            renderer.setSize(overlay_container_width, overlay_container_height);
            renderer.setClearColor(0xffffff, 0);
            overlay_container.append(renderer.domElement);

            var path = $window.location.origin + $scope.relationship.overlay_url;
            var texture = THREE.ImageUtils.loadTexture(path, {}, function() {
                renderer.render($scope.scene);
            });
            var geometry = new THREE.CubeGeometry( parseInt($scope.relationship.relationship_w, 10), parseInt($scope.relationship.relationship_h, 10), parseInt($scope.relationship.relationship_d, 10));
            var material = new THREE.MeshBasicMaterial( { map: texture } );

            $scope.object = new THREE.Mesh(geometry, material );
            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseInt($scope.relationship.relationship_x, 10);
            $scope.object.position.y = parseInt($scope.relationship.relationship_y, 10);
            $scope.object.position.z = parseInt($scope.relationship.relationship_z, 10);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.object.scale.x = 0.036; //FIXME: iframe is shown too big, number is used to minimize it
            $scope.object.scale.y = 0.036; //FIXME: iframe is shown too big, number is used to minimize it
            $scope.object.scale.z = 0.036; //FIXME: iframe is shown too big, number is used to minimize it
            $scope.scene.add($scope.object);
            console.log($scope.object);

            control = new THREE.TransformControls(camera, renderer.domElement);
            control.addEventListener('change', render );

            control.attach($scope.object);
            $scope.scene.add(control);
        }

        window.addEventListener( 'keydown', function ( event ) {
            switch ( event.keyCode ) {
                case 67: // C
                    controlOn =! controlOn;
                    if(controlOn == true){
                        console.log("controlls on");
                        control = new THREE.TransformControls(camera, renderer.domElement);
                        control.addEventListener('change', render );

                        control.attach($scope.object);
                        $scope.scene.add(control);
                    }
                    else{
                        console.log("controlls off");
                        $scope.scene.remove(control);
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

            if($scope.relationship.overlay_category == "picture"){
                renderer.render($scope.scene, camera);
            };
            if($scope.relationship.overlay_category == "website"){
                cssRenderer.render($scope.scene, camera);
            }
        };

        render();

    }



    /*************************************************
     INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_RELATIONSHIP') };
    $scope.relationship_label = 'embedded_in';

    // Load relationship
    $relationshipService.retrieve_by_id($scope.relationship_label, $routeParams.relationship_id)
        .then(function onSuccess(response) {
            $scope.relationship = response.data;
            console.log($scope.relationship);

            $scope.changeSource($scope.relationship.video_url);

            setTimeout(function(){ $scope.setOverlays(); }, 5000);

            $scope.$parent.loading = { status: false, message: "" };


        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

});
