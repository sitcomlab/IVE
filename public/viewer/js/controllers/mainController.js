var app = angular.module("ive");


/**
 * Main Controller
 */
app.controller("mainController", function ($scope, $rootScope, $window, config, $routeParams, $filter, $location, $translate, $videoService, $locationService, $overlayService, $sce, $socket, _, $relationshipService) {


    // Init
    $scope.current = {
        scenarioStatus: false,
        locationStatus: false,
        videoStatus: false
    };
    $scope.hasNotPlayed = true;


    /**
     * [changeSource description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    function changeSource(path) {
        path = $window.location.origin + config.videoFolder + path;
        let videoExtension = path.substr(path.length - 3);

        // if not extention in the url
        if (videoExtension !== "mp4" && videoExtension !== "ogg") {
            var mp4path = path + '.mp4';
            var oggpath = path + '.ogg';
        } else {
            var mp4path = path;
            var oggpath = path;
        }
        pathMp4 = mp4path;
        pathOgg = oggpath;
        $("#video").find("#srcmp4").attr("src", pathMp4)
        $("#video").find("#srcogg").attr("src", pathOgg)
        $("#video").attr("loop", !$scope.transition)
        $("#video-container video")[0].load();
        var vidload = document.getElementById("video");
        vidload.onloadeddata = function () {
            getOverlays();
        };
    };

    /**
     * [play description]
     * @return {[type]}      [description]
     */
    $scope.play = function () {
        document.querySelector("video").play();
    };

    /**
     * [handleFirstPlay description]
     * @return {[type]}      [description]
     */
    handleFirstPlay = function (event) {
        if ($scope.hasNotPlayed === true) {
            $scope.hasNotPlayed = false;
            $scope.$apply();
            let vid = event.target;
            vid.onplay = null;
        }
    }

    // Load the overlays to the selected video
    function getOverlays () {
        let embeddedIn
        return $relationshipService.list_by_label("embedded_in", $scope.pagination, $scope.filter)
            .then(function (responseEmbeddedIn) {
                embeddedIn = responseEmbeddedIn
                $scope.filter = {};
                $scope.filter.relationship_type = "overlay";
                return $relationshipService.list_by_label("belongs_to", $scope.pagination, $scope.filter)
            })
            .then(function (responseBelongsTo) {
                $scope.filter = undefined;
                $scope.relationships = [];
                for (let i = 0; i < embeddedIn.data.length; i++) {
                    if (embeddedIn.data[i].video_id === $scope.current.video.video_id) {
                        for (let k = 0; k < responseBelongsTo.data.length; k++) {
                            if (embeddedIn.data[i].overlay_id === responseBelongsTo.data[k].overlay_id && responseBelongsTo.data[k].scenario_id === $scope.scenarioId) {
                                let exists = false;
                                if ($scope.relationships.length > 0) {
                                    for (let j = 0; j < $scope.relationships.length; j++) {
                                        if ($scope.relationships[j] === embeddedIn.data[i]) {
                                            exists = true;
                                        }
                                        if (j === $scope.relationships.length - 1 && exists === false) {
                                            $scope.relationships.push(embeddedIn.data[i])
                                        }
                                    }
                                }
                                else {
                                    $scope.relationships.push(embeddedIn.data[i])
                                }
                            }
                        }
                    }
                    if (i === embeddedIn.data.length - 1) {
                        setOverlays();
                    }
                }
            });

    };

    // Show the overlays in the overlay-container
    function setOverlays () {
        // Setting everything to NULL, prevent loading issues
        $scope.scene = null;
        $scope.renderer = null;
        $scope.cssRenderer = null;
        var video_container = $('#video-container');
        if ($scope.overlay_container) {
            $scope.overlay_container.remove();
            $scope.overlay_container = null;
        }

        // Creating the overlay container
        video_container.after('<div id="overlay-container"></div>');

        // Getting the right size for the overlay-container
        $scope.overlay_container = $('#overlay-container');
        var overlay_container_width = $('#video-container').width();
        var overlay_container_height = $('#video-container').height();

        // Creating the scene
        $scope.scene = new THREE.Scene();

        // Creating the camera
        $scope.camera = new THREE.PerspectiveCamera(75, overlay_container_width / overlay_container_height, 1, 3000);
        // camera.position.set( 0, 101, 300 );
        $scope.camera.lookAt($scope.scene.position);
        $scope.camera.position.z = 5;

        // Make sure that Three.js uses CORS to load external urls as textures, for example.
        THREE.ImageUtils.crossOrigin = '';

        // Creating the cssRenderer
        $scope.cssRenderer = new THREE.CSS3DRenderer({
            alpha: true
        });
        $scope.cssRenderer.setSize(overlay_container_width, overlay_container_height);
        // $scope.cssRenderer.setClearColor(0xffffff, 0);       Not working on windows
        $scope.cssRenderer.domElement.style.position = 'absolute';
        $scope.cssRenderer.domElement.style.zIndex = 101;
        $scope.overlay_container.append($scope.cssRenderer.domElement);

        // Creating the glRenderer
        $scope.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        $scope.renderer.setSize(overlay_container_width, overlay_container_height);
        $scope.renderer.setClearColor(0xffffff, 0);
        $scope.renderer.domElement.style.position = 'absolute';
        $scope.renderer.domElement.style.zIndex = 100;
        $scope.overlay_container.append($scope.renderer.domElement);

        // Create the pointing overlay

        var elementpointing = document.createElement('iframe');
        elementpointing.src = "http://navas.staff.ifgi.de/ive_backend/";
        iframe_w = overlay_container_width / 3; // The iframe mst show the whole website; Scaled down later
        iframe_h = overlay_container_height; // The iframe must show the whole website; Scaled down later
        elementpointing.style.width = parseFloat(iframe_w) + 'px';
        elementpointing.style.height = parseFloat(iframe_h) + 'px';
        elementpointing.style.position = 'absolute';
        elementpointing.style.border = '0px';
        let marginLeft = overlay_container_width / 3;
        elementpointing.style.marginLeft = parseFloat(marginLeft) + 'px';
        elementpointing.style.visibility = "hidden";
        elementpointing.id = "pointing";
        elementpointing.style.zIndex = 90;
        $scope.overlay_container.append(elementpointing);

        // Create Overlays
        for (var i = 0; i < $scope.relationships.length; i++) {
            // If Website
            if ($scope.relationships[i].overlay_category === "website") {
                // Creating the iframe
                var element = document.createElement('iframe');
                element.src = $scope.relationships[i].overlay_url;
                iframe_w = $scope.relationships[i].relationship_w * 100; // The iframe must show the whole website; Scaled down later
                iframe_h = $scope.relationships[i].relationship_h * 100; // The iframe must show the whole website; Scaled down later
                element.style.width = parseFloat(iframe_w) + 'px';
                element.style.height = parseFloat(iframe_h) + 'px';
                element.style.border = '0px';
                element.style.visibility = "visible";
                element.id = $scope.relationships[i].overlay_id;

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
                if(typeof $scope.current_state != "undefined") {
                    if(typeof $scope.current_state.overlay[$scope.relationships[i].overlay_id] != "undefined"){
                        objectCSS.visible = $scope.current_state.overlay[$scope.relationships[i].overlay_id];
                    }
                }
                $scope.scene.add(objectCSS);
            }
            // If image
            if ($scope.relationships[i].overlay_category === "picture") {
                // Setting the image as texture for the object
                var path = $window.location.origin + $scope.relationships[i].overlay_url;
                var texture = THREE.ImageUtils.loadTexture(path, {}, function () {
                    $scope.renderer.render($scope.scene);
                });
                var geometry = new THREE.PlaneGeometry(parseFloat($scope.relationships[i].relationship_w), parseFloat($scope.relationships[i].relationship_h));
                var material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });

                // Creating the object
                var object = new THREE.Mesh(geometry, material);
                object._overlay = $scope.relationships[i];
                object.position.x = parseFloat($scope.relationships[i].relationship_x);
                object.position.y = parseFloat($scope.relationships[i].relationship_y);
                object.position.z = parseFloat($scope.relationships[i].relationship_z);
                object.rotation.x = parseFloat($scope.relationships[i].relationship_rx);
                object.rotation.y = parseFloat($scope.relationships[i].relationship_ry);
                object.rotation.z = parseFloat($scope.relationships[i].relationship_rz);
                object.name = $scope.relationships[i].overlay_id;
                if(typeof $scope.current_state != "undefined") {
                    if(typeof $scope.current_state.overlay[$scope.relationships[i].overlay_id] != "undefined"){
                        object.visible = $scope.current_state.overlay[$scope.relationships[i].overlay_id];
                    }
                }
                
                $scope.scene.add(object);
            }
            // If video
            if ($scope.relationships[i].overlay_category === "video") {
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
                if(typeof $scope.current_state != "undefined") {
                    if(typeof $scope.current_state.overlay[$scope.relationships[i].overlay_id] != "undefined"){
                        object.visible = $scope.current_state.overlay[$scope.relationships[i].overlay_id];
                    }
                }
                $scope.scene.add(object);
            }
            // If Distance
            if ($scope.relationships[i].overlay_category === "distance") {

                var meters = $scope.relationships[i].overlay_distance_meters.toString();
                var allSeconds = $scope.relationships[i].overlay_distance_seconds.toString();
                var minutes = Math.floor(allSeconds / 60);
                var seconds = allSeconds - minutes * 60;
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                context.font = "Bold 40px Arial";
                context.fillStyle = "rgba(255,0,0,0.95)";
                context.fillText(meters + " m", 0, 40);
                if (seconds < 10) {
                    context.fillText(minutes + ":" + "0" + seconds + " min", 0, 80)
                } else {
                    context.fillText(minutes + ":" + seconds + " min", 0, 80)
                };

                var texture = new THREE.Texture(canvas) 
                texture.needsUpdate = true;
                
                var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
                material.transparent = true;

                // Creating the object
                var object = new THREE.Mesh(
                    new THREE.PlaneGeometry(parseFloat($scope.relationships[i].relationship_w), parseFloat($scope.relationships[i].relationship_h)),
                    material);
                object._overlay = $scope.relationships[i];
                object.position.x = parseFloat($scope.relationships[i].relationship_x);
                object.position.y = parseFloat($scope.relationships[i].relationship_y);
                object.position.z = parseFloat($scope.relationships[i].relationship_z);
                object.rotation.x = parseFloat($scope.relationships[i].relationship_rx);
                object.rotation.y = parseFloat($scope.relationships[i].relationship_ry);
                object.rotation.z = parseFloat($scope.relationships[i].relationship_rz);
                object.name = $scope.relationships[i].overlay_id;
                if(typeof $scope.current_state != "undefined") {
                    if(typeof $scope.current_state.overlay[$scope.relationships[i].overlay_id] != "undefined"){
                        object.visible = $scope.current_state.overlay[$scope.relationships[i].overlay_id];
                    }
                }
                
                $scope.scene.add(object);
            }
        }

        // Render the scene
        var render = function () {
            requestAnimationFrame(render);
            $scope.cssRenderer.render($scope.scene, $scope.camera);
            $scope.renderer.render($scope.scene, $scope.camera);
        };

        render();
    };

    /**
     * [scenario description]
     * @type {String}
     */
    $socket.on('/set/scenario', function (data) { setScenario(data) });
    function setScenario (data) {
        console.log(new Date() + " /set/scenario: " + data.scenario_id);
        $scope.scenarioId = data.scenario_id;
        $scope.current = {
            scenarioStatus: true,
            locationStatus: false,
            videoStatus: false
        };
    };

    /**
     * [location description]
     * @type {String}
     */
    $socket.on('/set/location', function (data) { setLocation(data) });
    function setLocation (data) {
        console.log(new Date() + " /set/location: " + data.location_id);
        $scope.current = {
            scenarioStatus: true,
            locationStatus: true,
            videoStatus: false
        };
        if (data.location_type === 'transition') {
            $scope.transition = true;
            return $locationService.list_by_location(data.location_id)
                .then(function onSuccess(response) {
                    $scope.connected_locations = response.data;
                    changeSource($scope.current.video.url);
                }).catch(function onError(response) {
                    $scope.err = response.data;
                });
        }
        else {
            $scope.transition = false;
        }
    }

    /**
    * [handleFirstPlay description]
    * @return {[type]}      [description]
    */
    handleTransitionEnd = function (event) {
        if ($scope.transition) {
            $socket.emit('/set/location', {
                location_id: $scope.connected_locations[0].location_id,
                location_type: $scope.connected_locations[0].location_type
            });
            $scope.$apply();
        }
    }



    /**
     * [video description]
     * @type {String}
     */
    $socket.on('/set/video', function (data) { setVideo(data) });
    function setVideo (data) {
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
                changeSource($scope.current.video.url);
            }).catch(function onError(response) {
                $scope.err = response.data;
            });
    };

    /**
     * [controls description]
     * @type {String}
     */
    $socket.on('/toggle/controls', function (data) {
        console.log(new Date() + " /toggle/controls: " + data.status);
        $scope.controls = data.status;
    });


    // Switch overlays on and off
    $socket.on('/toggle/overlay', function (data) { setOverlay(data) });
    function setOverlay (data) {
        for (let i = 0; i < $scope.scene.children.length; i++) {
            if ($scope.scene.children[i].name === data.overlay_id && data.display === false) {
                $scope.scene.children[i].visible = false;
                if (data.type === "website") {
                    $('#' + data.overlay_id).css('visibility', 'hidden');
                }
            }
            if ($scope.scene.children[i].name === data.overlay_id && data.display === true) {
                $scope.scene.children[i].visible = true;
                if (data.type === "website") {
                    $('#' + data.overlay_id).css('visibility', 'visible');
                }
            }
        }
    };

    // Switch pointing overlay on and off
    $socket.on('/toggle/pointing', function (data) {
        if (data.display === true) {
            $('#pointing').css('visibility', 'visible');

        } else {
            $('#pointing').css('visibility', 'hidden');
        }
    });

    // Live changing of the overlay
    $socket.on('/change/values', function (data) {
        for (let i = 0; i < $scope.scene.children.length; i++) {
            if ($scope.scene.children[i]._overlay.relationship_id === data.relationship_id) {
                if ($scope.scene.children[i]._overlay.overlay_category === "website") {
                    $scope.scene.children[i].scale.x = data.size_x * 0.01;
                    $scope.scene.children[i].scale.y = data.size_y * 0.01;
                }
                else {
                    $scope.scene.children[i].scale.x = data.size_x;
                    $scope.scene.children[i].scale.y = data.size_y;
                }
                $scope.scene.children[i].position.x = data.translation_x;
                $scope.scene.children[i].position.y = data.translation_y;
                $scope.scene.children[i].position.z = data.translation_z;
                $scope.scene.children[i].quaternion._w = data.rotation_w;
                $scope.scene.children[i].quaternion._x = data.rotation_x;
                $scope.scene.children[i].quaternion._y = data.rotation_y;
                $scope.scene.children[i].quaternion._z = data.rotation_z;
            }
        }
    });

    // Replacing the overlay
    $socket.on('/change/saveValues', function (data) {
        getOverlays();
    });


    $socket.on('/get/state', function(data){
        $scope.current_state = data;

        $scope.current = {
            scenarioStatus: false,
            locationStatus: false,
            videoStatus: false
        };

        if (data.scenario) {
            $scope.current.scenarioStatus = true;
            setScenario(data.scenario);
        };
        if (data.location) {
            $scope.current.locationStatus = true;
            setLocation(data.location);
        };
        if (data.video) {
            $scope.current.videoStatus = true;
            setVideo(data.video);
        };

        getOverlays().then(function () {
            Object.keys(data.overlay).forEach(function (key) {
                current_overlay = {};
                current_overlay.overlay_id = key;
                current_overlay.display = data.overlay[key];
                setOverlay(current_overlay);
            })
        });

    });

    $socket.emit('/get/state');
});
