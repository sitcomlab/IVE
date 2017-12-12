var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function($scope, $rootScope, $window, config, $routeParams, $filter, $location, $translate, $videoService, $overlayService, $sce, $socket, _, $relationshipService) {


    // Init
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
        path = $window.location.origin + config.videoFolder + path;
        pathMp4 = path + ".mp4";
        pathOgg = path + ".ogg";
        $("#video").find("#srcmp4").attr("src", pathMp4)
        $("#video").find("#srcogg").attr("src", pathOgg)
        $("#video-container video")[0].load();
        var vidload = document.getElementById("video");
        vidload.onloadeddata = function() {
            // var vidCon = $( '#video-container' );
            // vidCon.after('<div id="overlay-container"></div>')
            $scope.getOverlays();
        };
    };

    // Load the overlays to the selected video
    $scope.getOverlays = function(){
        $relationshipService.list_by_label("embedded_in", $scope.pagination, $scope.filter)
            .then(function(response){
                $scope.relationships = [];
                for(var i = 0; i < response.data.length; i++){
                    if(response.data[i].video_id === $scope.current.video.video_id){
                        $scope.relationships.push(response.data[i])
                    }
                    if(i === response.data.length - 1){
                        $scope.setOverlays();
                    }
                }
            })
    };

    // Show the overlays in the overlay-container
    $scope.setOverlays = function(){
        // Setting everything to NULL, prevent loading issues
        $scope.scene = null;
        $scope.renderer = null;
        $scope.cssRenderer = null;
        var video_container = $( '#video-container' );
        if($scope.overlay_container){
            $scope.overlay_container.remove();
            $scope.overlay_container = null;
        }

        // Creating the overlay container
        video_container.after('<div id="overlay-container"></div>');

        // Getting the right size for the overlay-container
        $scope.overlay_container = $( '#overlay-container' );
        var overlay_container_width = $( '#video-container' ).width();
        var overlay_container_height = $( '#video-container' ).height();

        // Creating the scene
        $scope.scene = new THREE.Scene();

        // Creating the camera
        var camera = new THREE.PerspectiveCamera( 75, overlay_container_width/overlay_container_height, 1, 3000 );
        // camera.position.set( 0, 101, 300 );
        camera.lookAt( $scope.scene.position );
        camera.position.z = 5;

        // Make sure that Three.js uses CORS to load external urls as textures, for example.
        THREE.ImageUtils.crossOrigin = '';

        // Creating the cssRenderer
        $scope.cssRenderer = new THREE.CSS3DRenderer({
            alpha: true
        });
        $scope.cssRenderer.setSize(overlay_container_width, overlay_container_height);
        $scope.cssRenderer.setClearColor(0xffffff, 0);
        $scope.cssRenderer.domElement.style.position = 'absolute';
        $scope.cssRenderer.domElement.style.zIndex = 101;
        //$scope.cssRenderer.domElement.style.top = 0;
        $scope.overlay_container.append($scope.cssRenderer.domElement);

        // Creating the glRenderer
        $scope.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        $scope.renderer.setSize(overlay_container_width, overlay_container_height);
        $scope.renderer.setClearColor(0xffffff, 0);
        $scope.renderer.domElement.style.position = 'absolute';
        $scope.renderer.domElement.style.zIndex = 100;
        //$scope.renderer.domElement.style.top = 0;
        $scope.overlay_container.append($scope.renderer.domElement);

        // Create Overlays
        for(var i = 0; i < $scope.relationships.length; i++){
            // If Website
            if($scope.relationships[i].overlay_category === "website"){
                // Creating the iframe
                var element = document.createElement('iframe');
                element.src = $scope.relationships[i].overlay_url;
                iframe_w = $scope.relationships[i].relationship_w * 100; // The iframe must show the whole website; Scaled down later
                iframe_h = $scope.relationships[i].relationship_h * 100; // The iframe must show the whole website; Scaled down later
                element.style.width = parseFloat(iframe_w) + 'px';
                element.style.height = parseFloat(iframe_h) + 'px';
                element.style.border = '0px';

                // Creating the css object
                var objectCSS = new THREE.CSS3DObject(element);
                objectCSS._overlay = $scope.relationships[i];
                objectCSS.position.x = parseFloat($scope.relationships[i].relationship_x);
                objectCSS.position.y = parseFloat($scope.relationships[i].relationship_y);
                objectCSS.position.z = parseFloat($scope.relationships[i].relationship_z);
                objectCSS.rotation.x = parseFloat($scope.relationships[i].relationship_rx);
                objectCSS.rotation.y = parseFloat($scope.relationships[i].relationship_ry);
                objectCSS.rotation.z = parseFloat($scope.relationships[i].relationship_rz);
                objectCSS.name = $scope.relationships[i].overlay_id;
                objectCSS.scale.x = 0.01; // Scale it down again to show the right size
                objectCSS.scale.y = 0.01; // Scale it down again to show the right size
                $scope.scene.add(objectCSS);
            }
            // If image
            if($scope.relationships[i].overlay_category === "picture"){
                // Setting the image as texture for the object
                var path = $window.location.origin + $scope.relationships[i].overlay_url;
                var texture = THREE.ImageUtils.loadTexture(path, {}, function() {
                    $scope.renderer.render($scope.scene);
                });
                var geometry = new THREE.PlaneGeometry( parseFloat($scope.relationships[i].relationship_w), parseFloat($scope.relationships[i].relationship_h));
                var material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });

                // Creating the object
                var object = new THREE.Mesh(geometry, material );
                object._overlay = $scope.relationships[i];
                object.position.x = parseFloat($scope.relationships[i].relationship_x);
                object.position.y = parseFloat($scope.relationships[i].relationship_y);
                object.position.z = parseFloat($scope.relationships[i].relationship_z);
                object.rotation.x = parseFloat($scope.relationships[i].relationship_rx);
                object.rotation.y = parseFloat($scope.relationships[i].relationship_ry);
                object.rotation.z = parseFloat($scope.relationships[i].relationship_rz);
                object.name = $scope.relationships[i].overlay_id;
                $scope.scene.add(object);
            }
            // If video
            if($scope.relationships[i].overlay_category === "video"){
                // Creating the video element
                var vid = document.createElement('video');

                //Setting the path to the video
                var path = $window.location.origin + $scope.relationships[i].overlay_url;

                // Setting the sources for the video
                var mp4Source = document.createElement('source');
                mp4Source.src = path;
                mp4Source.type = 'video/mp4';
                vid.appendChild(mp4Source);

                var ogvSource = document.createElement('source');
                ogvSource.src = path;
                ogvSource.type = 'video/ogg';
                vid.appendChild(ogvSource);

                // Setting video properties
                vid.autoplay = 'autoplay';
                vid.loop = 'loop';
                vid.style.display = 'none';

                // Setting the video as the texture for the object
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
                var geometry = new THREE.PlaneGeometry(parseFloat($scope.relationships[i].relationship_w), parseFloat($scope.relationships[i].relationship_h));

                // Creating the object
                object = new THREE.Mesh(geometry, material);
                object._overlay = $scope.relationships[i];
                object.position.x = parseFloat($scope.relationships[i].relationship_x);
                object.position.y = parseFloat($scope.relationships[i].relationship_y);
                object.position.z = parseFloat($scope.relationships[i].relationship_z);
                object.rotation.x = parseFloat($scope.relationships[i].relationship_rx);
                object.rotation.y = parseFloat($scope.relationships[i].relationship_ry);
                object.rotation.z = parseFloat($scope.relationships[i].relationship_rz);
                object.name = $scope.relationships[i].overlay_id;
                $scope.scene.add(object);
            }
        }

        // Render the scene
        var render = function () {
            requestAnimationFrame( render );
            $scope.cssRenderer.render($scope.scene, camera);
            $scope.renderer.render($scope.scene, camera);
        };

        render();
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
        $videoService.list_by_location(data.location_id)
        .then(function onSuccess(response) {
            $scope.videos = response.data;

            // Check for videos
            if($scope.videos.length !== 0){

                // Find preferred video
                $scope.current.video = _.findWhere($scope.videos, {
                    preferred: true
                });

                // Check for preferred video
                if($scope.current.video === -1){
                    delete $scope.current.video;
                    console.log("No preferred videos found");
                } else {
                    $scope.current.videoStatus = true;

                    // Add to video player
                    $scope.changeSource($scope.current.video.url);
                }
            } else {
                console.log("No videos found");
            }

        }).catch(function onError(response) {
            $scope.err = response.data;
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
        $videoService.get(data.video_id)
        .then(function onSuccess(response) {
            $scope.current.video = response.data;

            // Add to video player
            $scope.changeSource($scope.current.video.url);

        }).catch(function onError(response) {
            $scope.err = response.data;
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

    $socket.on('/toggle/overlay', function(data){
        for(var i = 0; i < $scope.scene.children.length; i++){
            if($scope.scene.children[i].name === data.overlay_id && data.display === false){
                $scope.scene.children[i].visible = false;
                console.log($scope.scene.children);
            }
            if($scope.scene.children[i].name === data.overlay_id && data.display === true){
                $scope.scene.children[i].visible = true;
                console.log($scope.scene.children);
            }
        }
    })
});
