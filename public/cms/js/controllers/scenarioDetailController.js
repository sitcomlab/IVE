var app = angular.module("ive_cms");

app.controller("scenarioDetailController", function ($scope, $rootScope, $route, $window, $document, config, $authenticationService, $videoService, $scenarioService, $locationService, $relationshipService, $overlayService, $location, $routeParams, $sce, $filter, leafletData, $interval, $q, $socket, Upload, $timeout) {

    $scope.subsite = "detail";
    $scope.editMode = false;

    var promise;
    $scope.videoIndoor = true;

    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var created_input = angular.element('#created-input');

    $rootScope.currentCategory = "Scenarios";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/scenarios');
    }
    $rootScope.currentSite = null;

    $authenticationService.authenticate(config.creatorLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });
    /**
     * 
     *      INIT
     * 
     */

    $scenarioService.retrieve($routeParams.scenario_id)
        .then(function onSuccess(response) {
            $scope.scenario = response.data;
            $scope.scenario.videos = [];

            $rootScope.currentSite = "Scenario: '" + $scope.scenario.name + "'";

            // Style date 
            $scope.scenario.created = $filter('timestamp')($scope.scenario.created);

            // Get relationship to get the belonging videos
            $relationshipService.list_by_type('belongs_to', 'video').then(function onSuccess(response) {
                var video_relations = response.data;
                video_relations.forEach(function (relation) {
                    if (relation.scenario_id === $scope.scenario.scenario_id) {
                        $scope.scenario.videos.push(relation);
                    }
                }, this);

                // Get the Location for each video and attach it
                $relationshipService.list_by_type('recorded_at').then(function onSuccess(response_rec) {
                    var video_locations = response_rec.data;

                    var videoMarkers = [];
                    video_locations.forEach(function (relation) {
                        $scope.scenario.videos.forEach(function (video, index) {
                            if (relation.video_id === video.video_id) {
                                $scope.scenario.videos[index].location = relation;
                                $scope.scenario.videos[index].overlays = [];

                                // Create Marker for every video's location
                                if ($scope.scenario.videos[index].location.location_type === 'outdoor' && $scope.scenario.videos[index].location.location_lat !== null && $scope.scenario.videos[index].location.location_lng !== null) {
                                    var location = new L.latLng($scope.scenario.videos[index].location.location_lat, $scope.scenario.videos[index].location.location_lng);
                                    var popupContent = `Video: ${$scope.scenario.videos[index].video_name} <br> Location: ${$scope.scenario.videos[index].location.location_name}`;
                                    var videoMarker = new L.Marker(location, {
                                        clickable: true
                                    }).bindPopup(popupContent);
                                    videoMarkers.push(videoMarker);
                                }
                            }
                        })
                    })

                    leafletData.getMap('scenarioDetailMap').then(function (map) {
                        var featureGroup = new L.featureGroup(videoMarkers).addTo(map);
                        map.fitBounds(featureGroup.getBounds(), {
                            animate: false,
                            padding: L.point(50, 50)
                        })
                    });

                    var filterOverlays = function (overlays) {
                        $relationshipService.list_by_type('belongs_to', 'overlay').then(function onSuccess(response) {
                            var filtered = [];
                            overlays.forEach(function (overlay) {
                                response.data.forEach(function (relation) {
                                    if (overlay.overlay_id === relation.overlay_id && relation.scenario_id === $scope.scenario.scenario_id) {
                                        if(filtered.length === 0){
                                            filtered.push(overlay);
                                        }
                                        for(let i = 0; i < filtered.length; i++){
                                            let doubled = false;
                                            if(overlay.relationship_id === filtered[i].relationship_id){
                                                doubled = true;
                                            }
                                            if(i === filtered.length - 1 && doubled === false){
                                                filtered.push(overlay);
                                            }
                                        }
                                    }
                                }, this);
                            }, this);
                            // Now display the filtered overlays
                            displayOverlays(filtered);
                        })
                    }

                    var displayOverlays = function (overlay_relations) {

                        $scope.scenario.videos.forEach(function (video, video_index) {
                            $scope.scenario.videos[video_index].overlays = [];
                            var i = 0;
                            overlay_relations.forEach(function (overlay, overlay_index) {
                                if (overlay.video_id === video.video_id) {
                                    $scope.scenario.videos[video_index].overlays[i] = overlay;
                                    i++;
                                }

                                if (i > 1) {
                                    $scope.scenario.videos[video_index].multipleOverlays = true
                                }

                            }, this);
                        })
                    }

                    // Get the Overlays for each video and attach them
                    $relationshipService.list_by_type('embedded_in').then(function onSuccess(response) {
                        var overlay_relations = response.data;
                        overlay_relations = filterOverlays(overlay_relations);
                    })
                })
            })
        });

    angular.extend($scope, {
        defaults: {
            tileLayer: "http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
            tileLayerOptions: {
                opacity: 0.9,
                detectRetina: true,
                reuseTiles: true
            },
            scrollWheelZoom: false
        }
    });

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    // Function that is triggered, when the delete button has been pressed
    $scope.deleteScenario = function () {
        var scenario_id = $scope.scenario.scenario_id;
        if ($window.confirm(`You are going to delete the Scenario. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {

                // First delete any relationships the scenario has
                // Since the API doesn't give a way to display all belongs_to relations we need to
                // do it individually for every 'label' (overlay, loc, vid) of belongs_to relation
                $relationshipService.list_by_type('belongs_to', 'video').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })

                $relationshipService.list_by_type('belongs_to', 'location').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })

                $relationshipService.list_by_type('belongs_to', 'overlay').then(function (response) {
                    var relations = response.data;
                    relations.forEach(function (relation) {
                        if (relation.scenario_id == scenario_id) {
                            $relationshipService.remove(relation.relation_id);
                        }
                    }, this);
                })

                // Then remove the scenario
                $scenarioService.remove(scenario_id).then(function (response) {
                    // .. and return to the overview
                    $scope.redirect('/scenarios');
                })


            }
        }
    }

    // Function that is triggered, when the edit button has been pressed
    $scope.editScenario = function () {

        if ($scope.editMode) {
            $scope.editMode = false;
            name_input.prop('disabled', true);
            desc_input.prop('disabled', true);
            tags_input.prop('disabled', true);
            created_input.prop('disabled', true);
        } else {
            $scope.editMode = true;
            // Enable input Fields
            // angular.element('.col-10 > .form-control').removeAttr('disabled');       // Saving changed values may confuse the db
        }
    }

    // Function that is triggered when the in editMode accessible button "delete" is clicked
    $scope.saveScenario = function () {
        // Validate input
        var isValid = true;

        if ($scope.scenario.name === "") {
            name_input.parent().parent().addClass('has-danger');
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.scenario.description === "") {
            desc_input.parent().parent().addClass('has-danger');
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Needs to be enabled when the tags are ready
        /*
        if ($scope.video.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.video.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.video.tags = tagArray;
        }
        */

        if ($scope.scenario.created !== "") {
            // Trying to create a new date
            var created_date = new Date(parseInt($scope.scenario.created.split('-')[0]), parseInt($scope.scenario.created.split('-')[1] - 1), parseInt($scope.scenario.created.split('-')[2]));
            // Check if it has been parsed correctly
            if (isNaN(created_date)) {
                created_input.parent().parent().addClass('has-danger');
                created_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (created_date > new Date()) {
                created_input.parent().parent().addClass('has-danger');
                created_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            created_input.parent().parent().addClass('has-danger');
            created_input.addClass('form-control-danger');
            isValid = false;
        }

        if (isValid) {
            $scenarioService.edit($scope.scenario.scenario_id, $scope.scenario).then(function (response) {
                if (response.status === 200) {
                    $scope.redirect('/scenarios');
                }
            });
        }
    }

    $scope.deleteVideo = function (video_id) {
        if ($window.confirm(`You are going to remove this Video from the Scenario. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                var video_to_delete;

                // Remove Video from the (over)view
                $scope.scenario.videos.forEach(function (video, index) {

                    if (video.video_id === video_id) {
                        video_to_delete = video;
                        $scope.scenario.videos.splice(index, 1);
                    }
                })

                // Remove belongs_to relation
                $relationshipService.remove(video_to_delete.relationship_id).then(function onSuccess(response) {

                })
            }
        }

    };

    $scope.deleteOverlay = function (video_id, overlay_id) {

        if ($window.confirm(`You are going to remove this Overlay from the Video. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                $scope.scenario.videos.forEach(function (video, index) {
                    if (video.video_id === video_id) {
                        $scope.scenario.videos[index].overlays.forEach(function (overlay, overlayIndex) {
                            if (overlay.overlay_id === overlay_id) {
                                $scope.scenario.videos[index].overlays.splice(overlayIndex, 1);

                                $relationshipService.remove(overlay.relationship_id).then(function onSuccess() {
                                    $relationshipService.list_by_type('belongs_to', 'overlay').then(function onSuccess(response) {
                                        response.data.forEach(function (relation) {
                                            if (relation.overlay_id === overlay_id) {
                                                $relationshipService.remove(relation.relationship_id);
                                            }
                                        }, this);
                                    })
                                })
                            }
                        })
                    }
                })

            }
        }

    };

    // Change the video source
    $scope.changeSource = function(path) {
        path = $window.location.origin + config.videoFolder + path;

	let videoExtension = path.substr(path.length - 3);

        console.log(videoExtension);
        // if not extention in the url
        if (videoExtension !== "mp4" && videoExtension !== "ogg") {
            var mp4path = path + '.mp4';
            var oggpath = path + '.ogg';
        }
        else{
            var mp4path = path;
            var oggpath = path;
        }

        pathMp4 = mp4path;
        pathOgg = oggpath;
	console.log(pathMp4);
        $("#video").find("#srcmp4").attr("src", pathMp4);
        $("#video").find("#srcogg").attr("src", pathOgg);
        $("#video-container video")[0].load();
        var vidload = document.getElementById("video");
        vidload.onloadeddata = function() {
            $scope.setOverlays();
        };
    };

    $scope.repositionOverlay = function (overlay) {
        $scope.repositionOverlayState = true;
        $scope.relationship = overlay;

        $scope.changeSource($scope.relationship.video_url);
    };

    // Round a number to dec decimals
    $scope.round = function(num, dec){
        let deferred = $q.defer();
        let rounded = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        deferred.resolve(rounded);
        return deferred.promise;
    };

    // loading the overlay, set the controls
    $scope.setOverlays = function(){
        // Getting the right size for the overlay-container
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
        camera.position.z = 5;

        // Make sure that Three.js uses CORS to load external urls as textures, for example.
        THREE.ImageUtils.crossOrigin = '';

        var control;

        // if overlay is an website
        if($scope.relationship.overlay_category === "website"){

            // Creating the cssRenderer
            var cssRenderer = new THREE.CSS3DRenderer({
                alpha: true
            });
            cssRenderer.setSize(overlay_container_width, overlay_container_height);
            // cssRenderer.setClearColor(0xffffff, 0);      Not working on windows
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
            iframe_w = $scope.relationship.relationship_w * 100; // The iframe must show the whole website; Scaled down later
            iframe_h = $scope.relationship.relationship_h * 100; // The iframe must show the whole website; Scaled down later
            element.style.width = parseFloat(iframe_w) + 'px';
            element.style.height = parseFloat(iframe_h) + 'px';
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
            $scope.objectCSS.scale.x = 0.01; // Scale it down again to show the right size
            $scope.objectCSS.scale.y = 0.01; // Scale it down again to show the right size
            $scope.scene.add($scope.objectCSS);

            // Creating the WebGl object
            var geometry = new THREE.PlaneGeometry( parseFloat($scope.relationship.relationship_w), parseFloat($scope.relationship.relationship_h));
            var material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                opacity: 0.0,
                side: THREE.doubleSided
            });

            // Creating the WebGL object
            $scope.object = new THREE.Mesh(geometry, material );
            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseFloat($scope.relationship.relationship_x);
            $scope.object.position.y = parseFloat($scope.relationship.relationship_y);
            $scope.object.position.z = parseFloat($scope.relationship.relationship_z);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.scene.add($scope.object);

            // Setting the controls for the WebGL Object
            control = new THREE.TransformControls(camera, renderer.domElement);
            // control.addEventListener('change', render );
            control.addEventListener('change', valuesChanged );

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

            // Setting the image as texture for the object
            var path = $window.location.origin + $scope.relationship.overlay_url;
            var texture = THREE.ImageUtils.loadTexture(path, {}, function() {
                renderer.render($scope.scene);
            });
            var geometry = new THREE.PlaneGeometry( parseFloat($scope.relationship.relationship_w), parseFloat($scope.relationship.relationship_h));
            var material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });

            // Creating the object
            $scope.object = new THREE.Mesh(geometry, material );
            console.log($scope.object);
            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseFloat($scope.relationship.relationship_x);
            $scope.object.position.y = parseFloat($scope.relationship.relationship_y);
            $scope.object.position.z = parseFloat($scope.relationship.relationship_z);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.scene.add($scope.object);

            // Setting the controls for the object
            control = new THREE.TransformControls(camera, renderer.domElement);
            // control.addEventListener('change', render );
            control.addEventListener('change', valuesChanged );

            control.attach($scope.object);
            $scope.scene.add(control);
            console.log($scope.scene);
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

            // Create the video element
            var vid = document.createElement('video');

            // Setting the path to the video
            var path = $window.location.origin + $scope.relationship.overlay_url;

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
            var geometry = new THREE.PlaneGeometry(parseFloat($scope.relationship.relationship_w), parseFloat($scope.relationship.relationship_h));

            // Creating the object
            $scope.object = new THREE.Mesh(geometry, material);
            $scope.object._overlay = $scope.relationship;
            $scope.object.position.x = parseFloat($scope.relationship.relationship_x);
            $scope.object.position.y = parseFloat($scope.relationship.relationship_y);
            $scope.object.position.z = parseFloat($scope.relationship.relationship_z);
            $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
            $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
            $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
            $scope.scene.add($scope.object);

            // Setting the controls for the object
            control = new THREE.TransformControls(camera, renderer.domElement);
            // control.addEventListener('change', render );
            control.addEventListener('change', valuesChanged );

            control.attach($scope.object);
            $scope.scene.add(control);
        }

        // if overlay is an object
        if($scope.relationship.overlay_category === "object"){
            // Create renderer and allow transparent background-color
            var renderer = new THREE.WebGLRenderer({
                alpha: true
            });
            renderer.setSize(overlay_container_width, overlay_container_height);
            renderer.domElement.style.position = 'absolute';
            renderer.setClearColor(0xffffff, 0);
            overlay_container.append(renderer.domElement);

            var pathObject = $window.location.origin + $scope.relationship.overlay_url;

            var loader = new THREE.OBJLoader();

            // load a resource
            loader.load(
                // resource URL
                pathObject,
                // called when resource is loaded
                function ( object ) {
                    console.log(object);
                    // Creating the object
                    $scope.object = object;
                    $scope.object._overlay = $scope.relationship;
                    $scope.object.position.x = parseFloat($scope.relationship.relationship_x);
                    $scope.object.position.y = parseFloat($scope.relationship.relationship_y);
                    $scope.object.position.z = parseFloat($scope.relationship.relationship_z);
                    $scope.object.rotation.x = parseFloat($scope.relationship.relationship_rx);
                    $scope.object.rotation.y = parseFloat($scope.relationship.relationship_ry);
                    $scope.object.rotation.z = parseFloat($scope.relationship.relationship_rz);
                    $scope.scene.add($scope.object);
                    console.log($scope.scene);

                    // Setting the controls for the object
                    control = new THREE.TransformControls(camera, renderer.domElement);
                    // control.addEventListener('change', render );
                    control.addEventListener('change', valuesChanged );

                    control.attach($scope.object);
                    $scope.scene.add(control);

                    render();

                },
                // called when loading is in progresses
                function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                // called when loading has errors
                function ( error ) {
                    console.log( 'An error happened' );
                    console.log(error);
                }
            );
        }

        // Switching the controls on and off
        window.addEventListener( 'keydown', function ( event ) {
            switch ( event.keyCode ) {
                case 67: // C
                    controlOn =! controlOn;
                    if(controlOn === true){
                        control = new THREE.TransformControls(camera, renderer.domElement);
                        // control.addEventListener('change', render );
                        control.addEventListener('change', valuesChanged );

                        control.attach($scope.object);
                        $scope.scene.add(control);
                    }
                    else{
                        $scope.scene.remove(control);
                    }
            }
        });

        // Switching between translate, rotate and scale
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
                case 83: // S
                    control.setMode("scale");
                    break;
                case 187:
                case 107: // +, =, num+
                    control.setSize(control.size + 0.1); // Make the controls bigger
                    break;
                case 189:
                case 109: // -, _, num-
                    control.setSize(Math.max(control.size - 0.1, 0.1)); // Make the controls smaller
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

        // Render the scene
        var render = function () {
            control.update();
            requestAnimationFrame( render );

            if($scope.relationship.overlay_category === "picture" || $scope.relationship.overlay_category === "video" || $scope.relationship.overlay_category === "object"){
                renderer.render($scope.scene, camera);
            }
            if($scope.relationship.overlay_category === "website"){
                cssRenderer.render($scope.scene, camera);
                renderer.render($scope.scene, camera);

                // Set the position of the CSS Object = WebGL Object
                $scope.objectCSS._overlay = $scope.relationship;
                $scope.objectCSS.position.x = $scope.object.position.x;
                $scope.objectCSS.position.y = $scope.object.position.y;
                $scope.objectCSS.position.z = $scope.object.position.z;
                $scope.objectCSS.rotation.x = $scope.object.rotation.x;
                $scope.objectCSS.rotation.y = $scope.object.rotation.y;
                $scope.objectCSS.rotation.z = $scope.object.rotation.z;
                $scope.objectCSS.scale.x = $scope.object.scale.x / 100; // Scale it down again to show the right size
                $scope.objectCSS.scale.y = $scope.object.scale.y / 100; // Scale it down again to show the right size
            }
        };
        render();
    };

    // Changing the values of the overlay in the viewer live
    function valuesChanged() {
        $scope.scene.updateMatrixWorld(true);

        // Getting translation, rotation, scale
        var translation = new THREE.Vector3();
        var rotationQ = new THREE.Quaternion();
        var scale = new THREE.Vector3();

        // Getting the Size and the Euler-Rotation
        $scope.object.matrixWorld.decompose(translation, rotationQ, scale);

        // Sending the new values in the viewer
        $socket.emit('/change/values', {
            relationship_id: $scope.relationship.relationship_id,
            overlay_id: $scope.relationship.overlay_id,
            size_x: scale.x,
            size_y: scale.y,
            translation_x: translation.x,
            translation_y: translation.y,
            translation_z: translation.z,
            rotation_x: rotationQ._x,
            rotation_y: rotationQ._y,
            rotation_z: rotationQ._z,
            rotation_w: rotationQ._w
        });
    }

    // Creating the div with the shortcuts
    $scope.createHelp = function(height){
        var div = document.createElement("div");
        height = height + 10;
        div.style.marginTop = height + "px";
        div.id = "helpcontainer";
        document.getElementById("repositionContainer").appendChild(div);
        $('#helpcontainer').append('<div ng-show="repositionOverlayState" id="help"><h1>Shortcuts</h1><ul><li>Controls on/off: c</li><li>Translate: t</li><li>Rotate: r</li><li>Scale: s</li><li>Controls bigger/smaller: +/-</li></ul></div>');
    };

    $scope.cancelReposition = function () {
        $scope.repositionOverlayState = false;
        $route.reload();
    }

    $scope.saveOverlayPosition = function () {

        $scope.scene.updateMatrixWorld(true);

        // Getting translation, rotation, scale
        let translation = new THREE.Vector3();
        let rotationQ = new THREE.Quaternion();
        let scale = new THREE.Vector3();

        // Getting the Size and the Euler-Rotation
        $scope.object.matrixWorld.decompose(translation, rotationQ, scale);
        let sizeX = scale.x * $scope.object.geometry.parameters.width;
        let sizeY = scale.y * $scope.object.geometry.parameters.height;
        let rotationE = new THREE.Euler().setFromQuaternion(rotationQ.normalize());

        // Setting all the new values, round to 4 decimals
        $scope.round(sizeX, 4)
            .then(function(data){
                $scope.relationship.relationship_w = data;
                $scope.round(sizeY, 4)
                    .then(function(data){
                        $scope.relationship.relationship_h = data;
                        $scope.round(translation.x, 4)
                            .then(function (data){
                                $scope.relationship.relationship_x = data;
                                $scope.round(translation.y, 4)
                                    .then(function(data){
                                        $scope.relationship.relationship_y = data;
                                        $scope.round(translation.z, 4)
                                            .then(function(data){
                                                $scope.relationship.relationship_z = data;
                                                $scope.round(rotationE._x, 4)
                                                    .then(function(data){
                                                        $scope.relationship.relationship_rx = data;
                                                        $scope.round(rotationE._y, 4)
                                                            .then(function(data){
                                                                $scope.relationship.relationship_ry = data;
                                                                $scope.round(rotationE._z, 4)
                                                                    .then(function(data){
                                                                        $scope.relationship.relationship_rz = data;

                                                                        // Saving the new values
                                                                        $relationshipService.edit('embedded_in', $scope.relationship.relationship_id, $scope.relationship)
                                                                            .then(function onSuccess(response) {
                                                                                $scope.relationship = response.data;
                                                                                $socket.emit('/change/saveValues', {
                                                                                    relationship_id: $scope.relationship.relationship_id
                                                                                });
                                                                                $scope.redirect('/scenarios/' + $scope.scenario.scenario_id);
                                                                                $route.reload();
                                                                                $scope.repositionOverlayState = false;
                                                                            })
                                                                            .catch(function onError(response) {
                                                                                $window.alert(response.data);
                                                                            });
                                                                    })
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
            });
    };

    /**
     * 
     *  Add overlay to existing scenario
     * 
     */
    $scope.addOverlay = function (video) {
        $scope.addOverlayState = true;
        $scope.baseVideo = video;
    };

    $scope.initOverlayAddition = function (isNew) {
        if (isNew) {
            // New overlay will be created
            $scope.newOverlayState = true;
            $scope.existingOverlayState = false;
            $scope.newOverlay = {
                name: "",
                description: "",
                url: "",
                category: "",
                tags: []
            }
        } else {
            // Load Picker for exisiting overlay
            $scope.existingOverlayState = true;
            $scope.newOverlayState = false;
            $overlayService.list()
                .then(function onSuccess(response) {
                    $scope.existingOverlays = response.data;
            })

        }

    };

    $scope.cancelOverlayAddition = function () {
        $scope.newOverlayState = false;
        $scope.existingOverlayState = false;
        $scope.newOverlay = {};
        $scope.existingOverlays = {};
        $route.reload();
    };

    // Upload an Image as an Overlay
    $scope.uploadImage = function(file, errFiles) {
        $scope.newOverlay.url = "/images/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.apiURL + '/overlays/uploadImage',
                method: 'POST',
                data: {file: file},
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    };

    // Upload an 3D-object as an Overlay
    $scope.uploadObject = function(file, errFiles) {
        $scope.newOverlay.url = "/objects/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.apiURL + '/overlays/uploadObject',
                method: 'POST',
                data: {file: file},
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    };

    // Upload an Image as an Overlay
    $scope.uploadVideo = function(file, errFiles) {
        $scope.newOverlay.url = "/videos/overlays/" + file.name;
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: config.apiURL + '/overlays/uploadVideo',
                method: 'POST',
                data: {file: file},
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    };

    $scope.submitNewOverlay = function (overlay) {
        $overlayService.create(overlay)
            .then(function onSuccess(response) {
                overlay = response.data;
                $relationshipService.create('belongs_to', {
                    scenario_id: $scope.scenario.scenario_id,
                    overlay_id: response.data.overlay_id
                }, 'overlay')
                    .then(function onSuccess(response) {
                        $scope.relationship = $relationshipService.init('embedded_in');
                        $scope.relationship.overlay_id = response.data.overlay_id;
                        $scope.relationship.video_id = $scope.baseVideo.video_id;
                        $relationshipService.create('embedded_in', $scope.relationship)
                            .then(function (responseOverlay) {
                                $scope.relationship = responseOverlay.data;
                                $scope.newOverlayState = false;
                                $scope.addOverlayState = false;

                                overlay.video_url = $scope.baseVideo.video_url;
                                overlay.video_id = $scope.baseVideo.video_id;
                                $scope.baseVideo = {};
                                overlay = $scope.relationship;
                                console.log(overlay);
                                $scope.repositionOverlay(overlay);
                            });
                    })
        })
    };

    $scope.submitExistingOverlay = function (overlay) {
        $relationshipService.create('belongs_to', {
            scenario_id: $scope.scenario.scenario_id,
            overlay_id: overlay.overlay_id
        }, 'overlay')
            .then(function onSuccess(response) {
                $scope.relationship = $relationshipService.init('embedded_in');
                $scope.relationship.overlay_id = response.data.overlay_id;
                $scope.relationship.video_id = $scope.baseVideo.video_id;
                $relationshipService.create('embedded_in', $scope.relationship)
                    .then(function (responseOverlay) {
                        $scope.relationship = responseOverlay.data;
                        $scope.newOverlayState = false;
                        $scope.addOverlayState = false;

                        overlay.video_url = $scope.baseVideo.video_url;
                        overlay.video_id = $scope.baseVideo.video_id;
                        $scope.baseVideo = {};
                        overlay = $scope.relationship;
                        $scope.repositionOverlay(overlay);
                    });
            })
    };

    /**
     * 
     *  Add video to existing scenario
     * 
     */
    $scope.addVideo = function () {
        $scope.editMode = false;
        $scope.addVideoState = true;
    };

    $scope.initVideoAddition = function (isNew) {
        if (isNew) {
            if ($window.confirm(`To add a new Video please create it seperately first. Do you want to be redirected to the 'Add a new Video'-Screen?`)) {
                $scope.redirect('/videos/create-new');
            } else {
                $route.reload()
            }
        } else {
            $scope.setupAddExistingVideoMap();
            $scope.existingVideoState = true;
            $scope.newVideoState = false;
        }

    };

    /**
     * [startPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.startPreview = function(video) {
        // store the interval promise
        $scope.currentPreview = 1;
        $scope.maxPreview = video.thumbnails;

        // stops any running interval to avoid two intervals running at the same time
        $interval.cancel(promise);

        // store the interval promise
        promise = $interval(function() {
            var index = $scope.scenario.videos.indexOf(video);
            if($scope.scenario.videos[index].thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.scenario.videos[index].thumbnail = $filter('thumbnail')($scope.scenario.videos[index], $scope.currentPreview);
            }
            $scope.currentPreview++;
        }, config.thumbnailSpeed);
    };

    /**
     * [stopPreview description]
     * @param  {[type]} video [description]
     * @return {[type]}       [description]
     */
    $scope.stopPreview = function(video) {
        $interval.cancel(promise);
    };

    $scope.cancelVideoAddition = function () {

        $scope.newVideoState = false;
        $scope.existingVideoState = false;
        $route.reload();
    };

    // Start the preview of a video
    $scope.startPreviewAddVideo = function(video) {
        // store the interval promise
        $scope.currentPreview = 1;
        $scope.maxPreview = video.thumbnails;

        // stops any running interval to avoid two intervals running at the same time
        $interval.cancel(promise);

        // store the interval promise
        promise = $interval(function() {
            let indexAddVideo = $scope.videos.indexOf(video);
            if($scope.videos[indexAddVideo].thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.videos[indexAddVideo].thumbnail = $filter('thumbnail')($scope.videos[indexAddVideo], $scope.currentPreview);
            }
            $scope.currentPreview++;
        }, config.thumbnailSpeed);
    };

    // Stop the preview of a video
    $scope.stopPreviewAddVideo = function(video) {
        $interval.cancel(promise);
    };

    // Start the preview of a video
    $scope.startPreviewAddVideoCoord = function(video) {
        // store the interval promise
        $scope.currentPreview = 1;
        $scope.maxPreview = video.thumbnails;

        // stops any running interval to avoid two intervals running at the same time
        $interval.cancel(promise);

        // store the interval promise
        promise = $interval(function() {
            let indexAddVideo = $scope.videosCoord.indexOf(video);
            if($scope.videosCoord[indexAddVideo].thumbnails > 1){
                if($scope.currentPreview >= $scope.maxPreview){
                    $scope.currentPreview = 1;
                }
                $scope.videosCoord[indexAddVideo].thumbnail = $filter('thumbnail')($scope.videosCoord[indexAddVideo], $scope.currentPreview);
            }
            $scope.currentPreview++;
        }, config.thumbnailSpeed);
    };

    // Stop the preview of a video
    $scope.stopPreviewAddVideoCoord = function(video) {
        $interval.cancel(promise);
    };

    // Add a Video as an object out of the list
    $scope.addListVideo = function(video){
        for(let i = 0; i < $scope.relationsRecAt.length; i++){
            if($scope.relationsRecAt[i].video_id === video.video_id){
                $scope.newVideo = video;
                $scope.newVideo.location = {
                    lat: $scope.relationsRecAt[i].location_lat,
                    lng: $scope.relationsRecAt[i].location_lng,
                    location_id: $scope.relationsRecAt[i].location_id
                };
            }
        }
    };


    $scope.submitVideo = function () {
        // Create relation

        console.log($scope.newVideo);
        $relationshipService.create('belongs_to', {
            scenario_id: $scope.scenario.scenario_id,
            video_id: $scope.newVideo.video_id
        }, 'video').then(function onSuccess(response) {
            console.log(response);
            $route.reload();
        })

    };
    /**
     * 
     *  Map Settings & setUp functions
     *  Search functions also included!
     * 
     */

    $scope.setupAddExistingVideoMap = function () {

        var videoMarkers = [];

        $videoService.list().then(function (videos) {
            // Get recorded_At relations
            $relationshipService.list_by_type('recorded_at').then(function (relations) {
                $scope.videos = [];
                $scope.relationsRecAt = relations.data;
                $scope.videosCoord = [];

                // create markers from recorded at relation when video.video_id relation.video_id matches
                videos.data.forEach(function (video, video_index) {

                    relations.data.forEach(function (relation) {
                        if (video.video_id === relation.video_id) {

                            // We dont want to display indoor locations
                            if (relation.location_type !== "indoor" && relation.location_lat !== null && relation.location_lng !== null) {

                                var myIcon = new L.Icon({
                                    iconUrl: 'images/videomarker.png',
                                    iconRetinaUrl: 'images/videomarker@2x.png',
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41]
                                });

                                var popupContent = `Selected Video: <br> Video Name: ${relation.video_name} <br> Description: ${relation.video_description} `;
                                var marker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), {
                                    clickable: true,
                                    icon: myIcon
                                }).bindPopup(popupContent);

                                marker.on('click', function (e) {
                                    $scope.newVideo = video;
                                    $scope.newVideo.location = {
                                        lat: relation.location_lat,
                                        lng: relation.location_lng,
                                        location_id: relation.location_id
                                    }
                                });
                                videoMarkers.push(marker);
                            }

                            if(relation.location_type === "indoor" || relation.location_lat === null || relation.location_lng === null){
                                $scope.videos.push(video);
                            }
                            else{
                                $scope.videosCoord.push(video);
                            }

                            if (video_index === videos.data.length - 1) {
                                leafletData.getMap('addExistingVideoMap').then(function (map) {
                                    // Clear map first;
                                    if ($scope.featureGroup !== null && $scope.featureGroup !== undefined) {
                                        map.removeLayer($scope.featureGroup);
                                    }
                                    $scope.featureGroup = new L.featureGroup(videoMarkers).addTo(map);
                                    map.fitBounds($scope.featureGroup.getBounds(), {
                                        animate: false,
                                        padding: L.point(50, 50)
                                    });
                                })
                            }
                        }

                    }, this);
                }, this);


                /**
                 * Function to search the videos
                 */

                $scope.searchVideo = function () {

                    var searchVideoMarkers = [];
                    relations.data.forEach(function (relation) {

                        // Add all if the term is empty
                        if ($scope.searchVideoTerm === "") {
                            if (relation.location_type !== "indoor" && relation.location_lat !== null && relation.location_lng !== null) {

                                var myIcon = new L.Icon({
                                    iconUrl: 'images/videomarker.png',
                                    iconRetinaUrl: 'images/videomarker@2x.png',
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41]
                                })

                                var popupContent = `Selected Video: <br> Video Name: ${relation.video_name} <br> Description: ${relation.video_description} `;
                                var marker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), {
                                    clickable: true,
                                    icon: myIcon
                                }).bindPopup(popupContent);

                                marker.on('click', function (e) {
                                    $scope.newVideo = {
                                        name: relation.video_name,
                                        description: relation.video_description,
                                        id: relation.video_id,
                                        recorded: relation.video_recorded,
                                        url: relation.video_url,
                                        created: relation.video_created,
                                        updated: relation.video_updated
                                    }
                                })
                                searchVideoMarkers.push(marker);
                            }
                            return;
                        }

                        // add matches
                        if (relation.video_name.search($scope.searchVideoTerm) != -1) {

                            var myIcon = new L.Icon({
                                iconUrl: 'images/videomarker.png',
                                iconRetinaUrl: 'images/videomarker@2x.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41]
                            })

                            var popupContent = `Selected Video: <br> Video Name: ${relation.video_name} <br> Description: ${relation.video_description} `;
                            var marker = new L.Marker(L.latLng(relation.location_lat, relation.location_lng), {
                                clickable: true,
                                icon: myIcon
                            }).bindPopup(popupContent);
                            marker.on('click', function (e) {

                                $scope.newVideo = {
                                    name: relation.video_name,
                                    description: relation.video_description,
                                    id: relation.video_id,
                                    recorded: relation.video_recorded,
                                    url: relation.video_url,
                                    created: relation.video_created,
                                    updated: relation.video_updated
                                }

                                $scope.existingVideo = true;

                            })

                            searchVideoMarkers.push(marker);
                        }

                    }, this);

                    // Clear map and add new featureGroup with searchResults
                    leafletData.getMap('addExistingVideoMap').then(function (map) {
                        map.removeLayer($scope.featureGroup);
                        $scope.featureGroup = new L.featureGroup(searchVideoMarkers).addTo(map);
                        map.fitBounds($scope.featureGroup.getBounds(), {
                            animate: false,
                            padding: L.point(50, 50)
                        });
                    })
                }
            })
        })
    }

});

// Directive to handle the overlay positioning mockup
app.directive('ngDraggable', function ($document) {
    return {
        restrict: 'A',
        scope: {
            dragOptions: '=ngDraggable'
        },
        link: function (scope, elem, attr) {
            var startX, startY, x = 0,
                y = 0,
                start, stop, drag, container;

            var width = elem[0].offsetWidth,
                height = elem[0].offsetHeight;

            // Obtain drag options
            if (scope.dragOptions) {
                start = scope.dragOptions.start;
                drag = scope.dragOptions.drag;
                stop = scope.dragOptions.stop;
                var id = scope.dragOptions.container;
                if (id) {
                    container = document.getElementById(id).getBoundingClientRect();
                }
            }

            // Bind mousedown event
            elem.on('mousedown', function (e) {
                e.preventDefault();
                startX = e.clientX - elem[0].offsetLeft;
                startY = e.clientY - elem[0].offsetTop;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
                if (start) start(e);
            });

            // Handle drag event
            function mousemove(e) {
                y = e.clientY - startY;
                x = e.clientX - startX;
                setPosition();
                if (drag) drag(e);
            }

            // Unbind drag events
            function mouseup(e) {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                if (stop) stop(e);
            }

            // Move element, within container if provided
            function setPosition() {
                if (container) {
                    if (x < container.left) {
                        x = container.left;
                    } else if (x > container.right - width) {
                        x = container.right - width;
                    }
                    if (y < container.top) {
                        y = container.top;
                    } else if (y > container.bottom - height) {
                        y = container.bottom - height;
                    }
                }

                elem.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }
        }
    }

})
