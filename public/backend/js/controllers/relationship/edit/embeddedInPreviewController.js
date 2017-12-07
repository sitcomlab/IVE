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

    // TODO: werte runden
    // TODO: Bug report button
    $scope.save = function(){
        // Position
        $scope.scene.updateMatrixWorld(true);
        var position = new THREE.Vector3();
        position.getPositionFromMatrix( $scope.object.matrixWorld );
        console.log("POSITION");
        console.log(position.x, position.y, position.z);
        console.log($scope.object.position);

        // Rotation
        var rotation = new THREE.Euler();
        $scope.object.getWorldRotation(rotation);
        console.log("ROTATION");
        console.log(rotation.x + ',' + rotation.y + ',' + rotation.z);
        console.log($scope.object.rotation);

        // Size
        var size = new THREE.Box3().setFromObject($scope.object);
        var x = (size.max.x - size.min.x);
        var y = (size.max.y - size.min.y);
        var z = (size.max.z - size.min.z);
        console.log("SIZE");
        console.log($scope.object.geometry.parameters.height * $scope.object.scale.y, $scope.object.geometry.parameters.width * $scope.object.scale.x);
        console.log(x,y);

        // Getting translation, rotation, scale
        var translation = new THREE.Vector3();
        var rotationQ = new THREE.Quaternion();
        var scale = new THREE.Vector3();

        $scope.object.matrixWorld.decompose(translation, rotationQ, scale);
        console.log(translation);
        console.log(rotationQ);
        console.log(scale.y * $scope.object.geometry.parameters.height, scale.x * $scope.object.geometry.parameters.width);

        $scope.relationship.relationship_w = x;
        $scope.relationship.relationship_h = y;
        $scope.relationship.relationship_x = position.x;
        $scope.relationship.relationship_y = position.y;
        $scope.relationship.relationship_z = position.z;
        $scope.relationship.relationship_rx = rotation.x;
        $scope.relationship.relationship_ry = rotation.y;
        $scope.relationship.relationship_rz = rotation.z;
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
        pathMp4 = path + ".mp4";
        pathOgg = path + ".ogg";
        $("#video").find("#srcmp4").attr("src", pathMp4)
        $("#video").find("#srcogg").attr("src", pathOgg)
        $("#video-container video")[0].load();
        var vidload = document.getElementById("video");
        vidload.onloadeddata = function() {
            $scope.setOverlays();
        };
    };

    // loading the overlay, set the controls
    $scope.setOverlays = function(){
        // Getting the right size
        var controlOn = true;
        var overlay_container = $( '#overlay-container' );

        var overlay_container_width = $( '#video-container' ).width();
        var overlay_container_height = $( '#video-container' ).height();

        // Create div for the shortcuts
        $scope.createHelp(overlay_container_height);

        // Creating the scene
        $scope.scene = new THREE.Scene();
        $scope.scene.add( new THREE.GridHelper( 1000, 10 ) );

        // Creating the camera
        var camera = new THREE.PerspectiveCamera( 75, overlay_container_width/overlay_container_height, 1, 3000 );
        // camera.position.set( 0, 101, 300 );
        camera.lookAt( $scope.scene.position );

        // Make sure that Three.js uses CORS to load external urls as textures, for example.
        THREE.ImageUtils.crossOrigin = '';

        var control;

        // if overlay is an website
        // TODO: ngRok nutzen (online)
        // TODO: Webteam schreiben
        if($scope.relationship.overlay_category === "website"){

            // Creating the cssRenderer
            var cssRenderer = new THREE.CSS3DRenderer({
                alpha: true
            });
            cssRenderer.setSize(overlay_container_width, overlay_container_height);
            cssRenderer.setClearColor(0xffffff, 0);
            cssRenderer.domElement.style.position = 'absolute';
            cssRenderer.domElement.style.zIndex = 100;
            overlay_container.append(cssRenderer.domElement);

            // Creating the glRenderer
            var renderer = new THREE.WebGLRenderer({
                alpha: true
            });
            renderer.setSize(overlay_container_width, overlay_container_height);
            renderer.setClearColor(0xffffff, 0);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.zIndex = 101;
            overlay_container.append(renderer.domElement);

            // Creating the iframe
            var element = document.createElement('iframe');
            element.src = $scope.relationship.overlay_url;
            iframe_w = $scope.relationship.relationship_w * 50;
            iframe_h = $scope.relationship.relationship_h * 50;
            element.style.width = parseFloat($scope.relationship.relationship_w) + 'px';
            element.style.height = parseFloat($scope.relationship.relationship_h) + 'px';
            element.style.border = '0px';

            // Creating the css object
            $scope.objectCSS = new THREE.CSS3DObject(element);
            $scope.objectCSS._overlay = $scope.relationship;
            $scope.objectCSS.position.x = parseFloat($scope.relationship.relationship_x);
            $scope.objectCSS.position.y = parseFloat($scope.relationship.relationship_y);
            $scope.objectCSS.position.z = parseFloat($scope.relationship.relationship_z);
            $scope.objectCSS.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.objectCSS.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.objectCSS.rotation.z = parseFloat($scope.relationship.relationship_rz);
            //$scope.objectCSS.scale.x = 0.02;
            //$scope.objectCSS.scale.y = 0.02;
            $scope.scene.add($scope.objectCSS);

            // Creating the WebGl object
            var geometry = new THREE.PlaneGeometry( parseFloat($scope.relationship.relationship_w), parseFloat($scope.relationship.relationship_h));
            var material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                opacity: 0.0,
                side: THREE.doubleSided
            });

            $scope.object = new THREE.Mesh(geometry, material );
            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseFloat($scope.relationship.relationship_x);
            $scope.object.position.y = parseFloat($scope.relationship.relationship_y);
            $scope.object.position.z = parseFloat($scope.relationship.relationship_z);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.scene.add($scope.object);


            control = new THREE.TransformControls(camera, renderer.domElement);
            control.addEventListener('change', render );

            control.attach($scope.object);
            $scope.scene.add(control);
        }



        // if overlay is an image
        if($scope.relationship.overlay_category === "picture"){
            // Create renderer and allow transparent backgroun-color
            var renderer = new THREE.WebGLRenderer({
                alpha: true
            });
            renderer.setSize(overlay_container_width, overlay_container_height);
            renderer.domElement.style.position = 'absolute';
            renderer.setClearColor(0xffffff, 0);
            overlay_container.append(renderer.domElement);

            var path = $window.location.origin + $scope.relationship.overlay_url;
            var texture = THREE.ImageUtils.loadTexture(path, {}, function() {
                renderer.render($scope.scene);
            });
            var geometry = new THREE.PlaneGeometry( parseFloat($scope.relationship.relationship_w), parseFloat($scope.relationship.relationship_h));
            var material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });

            $scope.object = new THREE.Mesh(geometry, material );
            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseFloat($scope.relationship.relationship_x);
            $scope.object.position.y = parseFloat($scope.relationship.relationship_y);
            $scope.object.position.z = parseFloat($scope.relationship.relationship_z);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.scene.add($scope.object);

            control = new THREE.TransformControls(camera, renderer.domElement);
            control.addEventListener('change', render );

            control.attach($scope.object);
            $scope.scene.add(control);
        }

        // if overlay is a video
        if($scope.relationship.overlay_category === "video"){
            // Create renderer and allow transparent background-color
            var renderer = new THREE.WebGLRenderer({
                alpha: true
            });
            renderer.setSize(overlay_container_width, overlay_container_height);
            renderer.domElement.style.position = 'absolute';
            renderer.setClearColor(0xffffff, 0);
            overlay_container.append(renderer.domElement);

            var vid = document.createElement('video');

            var path = $window.location.origin + $scope.relationship.overlay_url;

            var mp4Source = document.createElement('source');
            mp4Source.src = path;
            mp4Source.type = 'video/mp4';
            vid.appendChild(mp4Source);

            var ogvSource = document.createElement('source');
            ogvSource.src = path;
            ogvSource.type = 'video/ogg';
            vid.appendChild(ogvSource);

            vid.autoplay = 'autoplay';
            vid.loop = 'loop';
            vid.style.display = 'none';

            if (vid) {
                var text = new THREE.VideoTexture(vid);
                text.minFilter = THREE.LinearFilter;
                text.magFilter = THREE.LinearFilter;
                text.format = THREE.RGBFormat;
                var material = new THREE.MeshBasicMaterial({
                    map: text,
                    side: THREE.DoubleSide
                });
                material.needsUpdate = true;
                vid.play(); // Make sure the video plays
            }

            var geometry = new THREE.PlaneGeometry(parseFloat($scope.relationship.relationship_w), parseFloat($scope.relationship.relationship_h));
            $scope.object = new THREE.Mesh(geometry, material);
            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseFloat($scope.relationship.relationship_x);
            $scope.object.position.y = parseFloat($scope.relationship.relationship_y);
            $scope.object.position.z = parseFloat($scope.relationship.relationship_z);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.scene.add($scope.object);

            control = new THREE.TransformControls(camera, renderer.domElement);
            control.addEventListener('change', render );

            control.attach($scope.object);
            $scope.scene.add(control);
        }

        window.addEventListener( 'keydown', function ( event ) {
            switch ( event.keyCode ) {
                case 67: // C
                    controlOn =! controlOn;
                    if(controlOn === true){
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
                case 37: // Left arrow
                        $scope.object.position.x = $scope.object.position.x - 0.2;
                    break;
                case 38: // Up arrow
                        $scope.object.position.y = $scope.object.position.y + 0.2;
                    break;
                case 39: // Right arrow
                        $scope.object.position.x = $scope.object.position.x + 0.2;
                    break;
                case 40: // Down arrow
                        $scope.object.position.y = $scope.object.position.y - 0.2;
                    break;
                case 84: // T
                    control.setMode("translate");
                    break;
                case 82: // R
                    control.setMode("rotate");
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

            if($scope.relationship.overlay_category === "picture"){
                renderer.render($scope.scene, camera);
            }
            if($scope.relationship.overlay_category === "website"){
                cssRenderer.render($scope.scene, camera);
                renderer.render($scope.scene, camera);

                $scope.objectCSS._overlay = $scope.relationship;
                $scope.objectCSS.position.x = $scope.object.position.x;
                $scope.objectCSS.position.y = $scope.object.position.y;
                $scope.objectCSS.position.z = $scope.object.position.z;
                $scope.objectCSS.rotation.x = $scope.object.rotation.x;
                $scope.objectCSS.rotation.y = $scope.object.rotation.y;
                $scope.objectCSS.rotation.z = $scope.object.rotation.z;
                $scope.objectCSS.scale.x = $scope.object.scale.x;
                $scope.objectCSS.scale.y = $scope.object.scale.y;
            }
            if($scope.relationship.overlay_category === "video"){
                renderer.render($scope.scene, camera);
            }
        };

        render();

    }

    $scope.createHelp = function(height){
        var div = document.createElement("div");
        height = height + 10;
        div.style.marginTop = height + "px";
        div.id = "helpcontainer";
        document.getElementById("container").appendChild(div);
        $('#helpcontainer').append('<div id="help"><h1>Shortcuts</h1><ul><li>Controls on/off: c</li><li>Translate: t</li><li>Rotate: r</li><li>Scale: s</li><li>Controls bigger/smaller: +/-</li></ul></div>');
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

            $scope.changeSource($scope.relationship.video_url);

            $scope.$parent.loading = { status: false, message: "" };
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

});
