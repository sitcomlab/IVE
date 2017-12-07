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
            $scope.getOverlays();
        };
    };

    $scope.getOverlays = function(){
        $relationshipService.list_by_label("embedded_in", $scope.pagination, $scope.filter)
            .then(function(response){
                $scope.relationships = [];
                for(var i = 0; i < response.data.length; i++){
                    if(response.data[i].video_id === $scope.current.video.video_id){
                        $scope.relationships.push(response.data[i])
                    }
                    if(i === response.data.length - 1){
                        console.log($scope.relationships);
                        $scope.setOverlays();
                    }
                }
            })
    };

    $scope.setOverlays = function(){
        // Getting the right size
        var overlay_container = $( '#overlay-container' );
        var overlay_container_width = $( '#video-container' ).width();
        var overlay_container_height = $( '#video-container' ).height();

        // Creating the scene
        $scope.scene = new THREE.Scene();
        $scope.scene.add( new THREE.GridHelper( 1000, 10 ) );

        // Creating the camera
        var camera = new THREE.PerspectiveCamera( 75, overlay_container_width/overlay_container_height, 1, 3000 );
        // camera.position.set( 0, 101, 300 );
        camera.lookAt( $scope.scene.position );

        // Make sure that Three.js uses CORS to load external urls as textures, for example.
        THREE.ImageUtils.crossOrigin = '';

        // Creating the cssRenderer
        var cssRenderer = new THREE.CSS3DRenderer({
            alpha: true
        });
        cssRenderer.setSize(overlay_container_width, overlay_container_height);
        cssRenderer.setClearColor(0xffffff, 0);
        cssRenderer.domElement.style.position = 'absolute';
        cssRenderer.domElement.style.zIndex = 101;
        //cssRenderer.domElement.style.float = 0;
        overlay_container.append(cssRenderer.domElement);

        // Creating the glRenderer
        var renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setSize(overlay_container_width, overlay_container_height);
        renderer.setClearColor(0xffffff, 0);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.zIndex = 100;
        //renderer.domElement.style.top = 0;
        overlay_container.append(renderer.domElement);

        // Create Overlays
        for(var i = 0; i < $scope.relationships.length; i++){
            // If Website
            if($scope.relationships[i].overlay_category === "website"){
                // Creating the iframe
                var element = document.createElement('iframe');
                element.src = $scope.relationships[i].overlay_url;
                iframe_w = $scope.relationships[i].relationship_w * 50;
                iframe_h = $scope.relationships[i].relationship_h * 50;
                element.style.width = parseFloat($scope.relationships[i].relationship_w) + 'px';
                element.style.height = parseFloat($scope.relationships[i].relationship_h) + 'px';
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
                //objectCSS.scale.x = 0.02;
                //objectCSS.scale.y = 0.02;
                $scope.scene.add(objectCSS);
            }
            // If image
            if($scope.relationships[i].overlay_category === "picture"){
                var path = $window.location.origin + $scope.relationships[i].overlay_url;
                var texture = THREE.ImageUtils.loadTexture(path, {}, function() {
                    renderer.render($scope.scene);
                });
                var geometry = new THREE.PlaneGeometry( parseFloat($scope.relationships[i].relationship_w), parseFloat($scope.relationships[i].relationship_h));
                var material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });

                var object = new THREE.Mesh(geometry, material );
                object._overlay = $scope.relationships[i];
                object.position.x = parseFloat($scope.relationships[i].relationship_x);
                object.position.y = parseFloat($scope.relationships[i].relationship_y);
                object.position.z = parseFloat($scope.relationships[i].relationship_z);
                object.rotation.x = parseFloat($scope.relationships[i].relationship_rx);
                object.rotation.y = parseFloat($scope.relationships[i].relationship_ry);
                object.rotation.z = parseFloat($scope.relationships[i].relationship_rz);
                $scope.scene.add(object);
            }
            // If video
            if($scope.relationships[i].overlay_category === "video"){
                var vid = document.createElement('video');
                var path = $window.location.origin + $scope.relationships[i].overlay_url;

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

                var geometry = new THREE.PlaneGeometry(parseFloat($scope.relationships[i].relationship_w), parseFloat($scope.relationships[i].relationship_h));
                object = new THREE.Mesh(geometry, material);
                object._overlay = $scope.relationships[i];
                object.position.x = parseFloat($scope.relationships[i].relationship_x);
                object.position.y = parseFloat($scope.relationships[i].relationship_y);
                object.position.z = parseFloat($scope.relationships[i].relationship_z);
                object.rotation.x = parseFloat($scope.relationships[i].relationship_rx);
                object.rotation.y = parseFloat($scope.relationships[i].relationship_ry);
                object.rotation.z = parseFloat($scope.relationships[i].relationship_rz);
                $scope.scene.add(object);
            }
        }

        camera.position.z = 5;

        var render = function () {
            requestAnimationFrame( render );
            cssRenderer.render($scope.scene, camera);
            renderer.render($scope.scene, camera);
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

});
