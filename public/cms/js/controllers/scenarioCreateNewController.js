var app = angular.module("ive_cms");

app.controller("scenarioCreateNewController", function ($scope, config, $authenticationService, $locationService, $relationshipService, $scenarioService, $videoService, $overlayService, $location, $document, leafletData, Upload, $sce, $rootScope, $window, $interval, $filter, $socket, $timeout, $q, $route) {

    $scope.currentState = {
        general: true, // General Information Input Screen
        addVideo: false, // Screen where a new video is created
        scenarioVideoOverview: false, // Overview over the scenario's videos
        createOverlay: false, // Overlay creation
        placeOverlay: false, // Overlay placement
        finishScenario: false // Scenario finish Screen
    };

    var promise;
    $scope.videoIndoor = true;
    $scope.locationTypeIndoor = true;

    $scope.currentState.general = true;

    $rootScope.currentCategory = "Scenarios";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/scenarios');
    }
    $rootScope.currentSite = "Create new scenario";

    // $scope.subsite = "create-new";

    $scope.newScenario = {
        name: "",
        description: "",
        tags: "",
        videos: []
        // created: null,
    };

    var scenarioCreated = false;

    // Authenticate with the creator to get permissions to create content
    $authenticationService.authenticate(config.creatorLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
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

    // Method to sumbit the general Scenario information, send it to the
    // server and handle the created object
    $scope.submitGeneral = function () {
        if ($scope.validateScenario() === true && !scenarioCreated) {

            // Send Scenario to Service 
            // Include Tags here when implemented
            $scenarioService.create($scope.newScenario)
                .then(function (response) {
                    $scope.newScenario = response.data;
                    $scope.newScenario.videos = [];
                    $scope.currentState.general = false;
                    $scope.currentState.scenarioVideoOverview = true;
                    angular.element('#step2').addClass('active');
                    scenarioCreated = true;
                })
        } else {
            return;
        }
    };

    // Function that triggers the addtion of a Video to the Scenario
    // Starts with a new Video Creation
    $scope.addVideo = function () {

        $scope.currentState.addVideo = true;
        $scope.currentState.scenarioVideoOverview = false;

        // indicates inside the scenarioVideoOverview state if you want to add a new or an existing vid
        $scope.existingVideo = false;
        $scope.existingLocation = true;

        $scope.newVideo = {
            name: "",
            description: "",
            tags: [],
            recorded: null,
            location: {}
        };

        $scope.featureGroup = null;
        $scope.uploadStarted = false;
        $scope.file_selected = false;

        $scope.setupAddNewVideoMap();
    };

    // onAddVideo Pressed
    $scope.submitVideo = function () {
        if ($scope.existingVideo) {
            // Existing video
            $scope.newScenario.videos.push($scope.newVideo);
            $scope.currentState.addVideo = false;
            $scope.currentState.scenarioVideoOverview = true;
            return;
        }

        if ($scope.validateVideo()) {
            // Upload video here
            console.log('Upload started.');
            $scope.uploadVideo();
        }

    };

    /**
     * Main Video Upload Function
     */

    $scope.uploadVideo = function () {

        var startUpload = function () {
            Upload.upload({
                    url: config.apiURL + '/videos/uploadVideo/' + uploadVideoData.location.name,
                    data: uploadVideoData,
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + $authenticationService.getToken()
                    }
                })
                .progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                    $scope.uploadStatus.currentPercentage = progressPercentage;
                    $scope.uploadStatus.loaded = evt.loaded;
                    $scope.uploadStatus.total = evt.total;

                    angular.element('.progress-bar').attr('aria-valuenow', progressPercentage).css('width', progressPercentage + '%');
                })
                .success(function (data, status, headers, config) {
                    console.log("Upload finished!");

                    $videoService.create({
                        name: $scope.newVideo.name,
                        description: $scope.newVideo.description,
                        url: '/' + uploadVideoData.location.name + '/' + uploadVideoData.file.name,
                        recorded: $scope.newVideo.recorded
                    }).then(function (createdVideo) {

                        if (createdVideo.status !== 201) {
                            $window.alert('It seems like the creator is not responding. Please try again later.');
                            return;
                        }

                        // Create relationship between location and the new video
                        var recorded_at = {
                            video_id: createdVideo.data.video_id,
                            location_id: newLocation.location_id,
                            description: "Recorded at",
                            preferred: true
                        };

                        $relationshipService.create('recorded_at', recorded_at)
                            .then(function (createdRelation) {
                                if (createdVideo.status === 201) {
                                    createdVideo.data.location = newLocation;
                                    $scope.newScenario.videos.push(createdVideo.data);
                                    $scope.currentState.addVideo = false;
                                    $scope.currentState.scenarioVideoOverview = true;
                                }

                            })

                    })

                })
                .error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                })
        };

        var newLocation;
        $scope.uploadStarted = true;
        $scope.uploadStatus = {
            currentPercentage: 0,
            loaded: 0,
            total: 0
        };

        var uploadVideoData = {
            file: $scope.uploadingVideo
        };

        if ($scope.existingLocation) {
            uploadVideoData.location = {
                name: $scope.newVideo.location.name,
                newVideo: $scope.newVideo
            };
            newLocation = $scope.newVideo.location;
            startUpload();
        } else {
            // Create location
            $locationService.create($scope.newVideo.location)
                .then(function (response) {
                    if (response.status !== 201) {
                        $window.alert('It seems like the creator is not responding. Please try again later.');
                        return;
                    }
                    $scope.newVideo.location = response.data;
                    newLocation = response.data;
                    uploadVideoData.location = {
                        name: $scope.newVideo.location.name,
                        newVideo: $scope.newVideo
                    };
                    startUpload();
                });
        }
    };

    $scope.removeTempVideo = function(index){
        $scope.newScenario.videos.splice(index, 1);
    };

    // Function to cancel an action and be redirected back to the last page
    $scope.cancel = function (origin) {
        switch (origin) {
            case 'scenarioVideoOverview':
                $scope.currentState.scenarioVideoOverview = false;
                $scope.currentState.general = true;
                return;
            case 'createOverlay':
                $scope.currentState.createOverlay = false;
                $scope.currentState.addVideo = true;
                return;
            case 'addVideo':
                $scope.existingVideo = false;
                $scope.currentState.addVideo = false;
                $scope.currentState.scenarioVideoOverview = true;
                $scope.currentState.createOverlay = false;
                return;
            case 'placeOverlay':
                $scope.currentState.placeOverlay = false;
                $scope.currentState.createOverlay = true;
                return;
            case 'finishScenario':
                $scope.currentState.finishScenario = false;
                $scope.currentState.scenarioVideoOverview = true;
                $scope.$apply();
                return;
        }
    };

    $scope.createOverlay = function () {

        if ($scope.newScenario.videos.length === 0) {
            $window.alert('Your Scenario needs at least one video...');
        }

        $scope.currentState.scenarioVideoOverview = false;
        $scope.currentState.createOverlay = true;
        angular.element('#step3').addClass('active');

        $scope.currentVideoIndex = 0;
        $scope.currentVideo = $scope.newScenario.videos[0];

        // Init video playback
        var videoExtension = $scope.currentVideo.url.split('.')[1];

        // Wenn keine extension in der URL war..
        if (videoExtension === null || videoExtension === undefined) {
            videoExtension = 'mp4';
            $scope.currentVideo.thumbnail_url = $scope.currentVideo.url + '_thumbnail.png';
            $scope.currentVideo.url += '.mp4';
        }

        let path = $window.location.origin + config.videoFolder + $scope.currentVideo.url;

        let videoExtensions = path.split('.')[1];

        // if not extention in the url
        if (videoExtensions === null || videoExtensions === undefined) {
            var mp4path = path + '.mp4';
            var oggpath = path + '.ogg';
        }
        else{
            var mp4path = path;
            var oggpath = path;
        }
        pathMp4 = mp4path;
        pathOgg = oggpath;
        $("#video").find("#srcmp4").attr("src", pathMp4);
        $("#video").find("#srcogg").attr("src", pathOgg);
        $("#video-container video")[0].load();

        // Variable to indicate wether to add an existing or a new overlay
        $scope.existingOverlay = false;
        $scope.existingOverlayId = null;

        $scope.newOverlay = {
            name: "",
            description: "",
            tags: [],
            category: "",
            url: ""
        };

        $scope.searchOverlay = function () {
            $overlayService.list().then(function (response) {
                var overlays = response.data;
                $scope.overlaySearchResults = [];

                if ($scope.searchOverlayTerm === "") {
                    // Add the first 5 Results to fill the space
                    $scope.overlaySearchResults = [response.data[0], response.data[1], response.data[2], response.data[3], response.data[4]];
                }
                overlays.forEach(function (overlay) {
                    if (overlay.name.search($scope.searchOverlayTerm) !== -1) {
                        $scope.overlaySearchResults.push(overlay);
                    }
                }, this);

            })
        };


        // Function that is called in the table of existing overlays
        $scope.selectOverlay = function (overlay) {
            $scope.selectedOverlay = overlay;
        }
    };

    // Function that is called when no Overlay wants to be added
    $scope.skipVideo = function () {

        // If it was the last video set the state to finishScenario
        if ($scope.currentVideoIndex === $scope.newScenario.videos.length - 1) {
            $scope.currentState.createOverlay = false;
            $scope.currentState.finishScenario = true;
        } else {
            $scope.currentVideoIndex++;
            $scope.currentVideo = $scope.newScenario.videos[$scope.currentVideoIndex];
            var videoExtension = $scope.currentVideo.url.split('.')[1];

            // Wenn keine extension in der URL war..
            if (videoExtension === null || videoExtension === undefined) {
                videoExtension = 'mp4';
                $scope.currentVideo.thumbnail_url = $scope.currentVideo.url + '_thumbnail.png';
                $scope.currentVideo.url += '.mp4';
            }

            // Change Video Preview
            $scope.videoConfig.sources = [{
                src: $sce.trustAsResourceUrl('/videos' + $scope.currentVideo.url),
                type: "video/" + videoExtension
            }];
        }
    };

    // Upload an image as an Overlay
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

    // Upload a video as an Overlay
    $scope.uploadVideoOverlay = function(file, errFiles) {
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

    $scope.submitOverlay = function () {
        // Add an overlay to the video
        var validateOverlay = function () {

            var name_input = angular.element('#overlay_name-input');
            var desc_input = angular.element('#overlay_desc-input');
            var tags_input = angular.element('#overlay_tags-input');
            var url_input = angular.element('#overlay_url-input');

            var isValid = true;

            if ($scope.newOverlay.name === "") {
                name_input.parent().parent().addClass('has-danger');
                name_input.addClass('form-control-danger');
                isValid = false;
            }

            if ($scope.newOverlay.description === "") {
                desc_input.parent().parent().addClass('has-danger');
                desc_input.addClass('form-control-danger');
                isValid = false;
            }

            // Put tags in array
            if ($scope.newOverlay.tags !== "") {
                // Parse array, grab them by the comma and remove the #
                var tagArray = [];
                $scope.newOverlay.tags.split(', ').forEach(function (element) {
                    if (element.charAt(0) === "#") {
                        tagArray.push(element.slice(1));
                    }
                }, this);
                $scope.newOverlay.tags_parsed = tagArray;
            }

            if (isValid) {
                return true;
            } else {
                return false;
            }
        };

        if ($scope.existingOverlay) {
            $relationshipService.create('belongs_to', {
                scenario_id: $scope.newScenario.scenario_id,
                overlay_id: $scope.selectedOverlay.overlay_id
            }, 'overlay')
                .then(function onSuccess(response) {
                    $scope.relationship = $relationshipService.init('embedded_in');
                    $scope.relationship.overlay_id = response.data.overlay_id;
                    $scope.relationship.video_id = $scope.newScenario.videos[$scope.currentVideoIndex].video_id;
                    $relationshipService.create('embedded_in', $scope.relationship)
                        .then(function (responseOverlay) {
                            $scope.relationship = responseOverlay.data;

                            $scope.existingOverlay.video_url = $scope.newScenario.videos[$scope.currentVideoIndex].video_url;
                            $scope.existingOverlay.video_id = $scope.newScenario.videos[$scope.currentVideoIndex].video_id;
                            $scope.existingOverlay = $scope.relationship;
                            console.log($scope.existingOverlay);
                            $scope.placeOverlay($scope.existingOverlay);
                        });
                });
            /*
            // Retrieve the existing overlay and attach it to the video
            $scope.newScenario.videos[$scope.currentVideoIndex].overlay = $scope.selectedOverlay;
            $scope.placeOverlay($scope.currentVideo.overlay);
            */
        } else {
            // Create new Overlay and attach the newly created to the video
            if (validateOverlay()) {
                $overlayService.create($scope.newOverlay)
                    .then(function onSuccess(response) {
                        $scope.newOverlay = response.data;
                        $relationshipService.create('belongs_to', {
                            scenario_id: $scope.newScenario.scenario_id,
                            overlay_id: response.data.overlay_id
                        }, 'overlay')
                            .then(function onSuccess(response) {
                                $scope.relationship = $relationshipService.init('embedded_in');
                                $scope.relationship.overlay_id = response.data.overlay_id;
                                $scope.relationship.video_id = $scope.newScenario.videos[$scope.currentVideoIndex].video_id;
                                $relationshipService.create('embedded_in', $scope.relationship)
                                    .then(function (responseOverlay) {
                                        $scope.relationship = responseOverlay.data;

                                        $scope.newOverlay.video_url = $scope.newScenario.videos[$scope.currentVideoIndex].video_url;
                                        $scope.newOverlay.video_id = $scope.newScenario.videos[$scope.currentVideoIndex].video_id;
                                        $scope.newOverlay = $scope.relationship;
                                        $scope.placeOverlay($scope.newOverlay);
                                    });
                            })
                    });

                /*
                $overlayService.create($scope.newOverlay)
                    .then(function (created_overlay) {
                        $scope.newScenario.videos[$scope.currentVideoIndex].overlay = created_overlay.data;
                        // Switch to Overlay Placement Screen
                        $scope.placeOverlay(created_overlay.data);
                })
                */
            } else {
                return;
            }
        }
    };

    // Placement of an Overlay
    $scope.placeOverlay = function (Overlay) {
        $scope.currentState.createOverlay = false;
        $scope.currentState.placeOverlay = true;

        $scope.positioningOverlay = Overlay;
        $scope.changeSource($scope.relationship.video_url);


        // At the end: Set state to createOverlay, increase index++ and set $scope.currentVideo if it's not the last video
        // If it's the last video set state to finishScenario

    };

    // Change the video source
    $scope.changeSource = function(path) {
        path = $window.location.origin + config.videoFolder + path;

        let videoExtension = path.split('.')[1];

        // if not extention in the url
        if (videoExtension === null || videoExtension === undefined) {
            var mp4path = path + '.mp4';
            var oggpath = path + '.ogg';
        }
        else{
            var mp4path = path;
            var oggpath = path;
        }
        pathMp4 = mp4path;
        pathOgg = oggpath;
        $("#videoOverlay").find("#srcmp4Overlay").attr("src", pathMp4);
        $("#videoOverlay").find("#srcoggOverlay").attr("src", pathOgg);
        $("#video-container-overlay video")[0].load();
        var vidload = document.getElementById("videoOverlay");
        vidload.onloadeddata = function() {
            $scope.setOverlays();
        };
    };

    // loading the overlay, set the controls
    $scope.setOverlays = function(){
        // Getting the right size for the overlay-container
        var controlOn = true;
        var overlay_container = $( '#overlay-container' );

        var overlay_container_width = $( '#video-container-overlay' ).width();
        var overlay_container_height = $( '#video-container-overlay' ).height();

        // Create div for the shortcuts
        // $scope.createHelp(overlay_container_height);

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
            // Create renderer and allow transparent background-color
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
        document.getElementById("video_container").appendChild(div);
        $('#helpcontainer').append('<div ng-show="currentState.placeOverlay" id="help"><h1>Shortcuts</h1><ul><li>Controls on/off: c</li><li>Translate: t</li><li>Rotate: r</li><li>Scale: s</li><li>Controls bigger/smaller: +/-</li></ul></div>');
    };

    // Round a number to dec decimals
    $scope.round = function(num, dec){
        let deferred = $q.defer();
        let rounded = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        deferred.resolve(rounded);
        return deferred.promise;
    };


    $scope.submitOverlayRotation = function () {

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
                                                                                console.log("BEFORE RELOAD");
                                                                                console.log("AFTER RELOAD");
                                                                                if ($scope.currentVideoIndex === $scope.newScenario.videos.length - 1) {
                                                                                    console.log("IF");
                                                                                    $scope.currentState.placeOverlay = false;
                                                                                    $scope.currentState.finishScenario = true;
                                                                                } else {
                                                                                    console.log("ELSE");
                                                                                    $scope.currentVideoIndex++;
                                                                                    $scope.currentVideo = $scope.newScenario.videos[$scope.currentVideoIndex];
                                                                                    $scope.currentState.placeOverlay = false;
                                                                                    $scope.currentState.createOverlay = true;
                                                                                }
                                                                            })
                                                                            .catch(function onError(response) {
                                                                                $window.alert(response.data);
                                                                                console.log(response.data);
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

    $scope.finishScenario = function () {
        $scope.submitScenario();
    };

    $scope.submitScenario = function () {
        // Add Video belongs_to relation -- for it's overlay, too if neccessary
        var scenario_id = $scope.newScenario.scenario_id;

        var createRelation = function (video, callback) {

            $relationshipService.create('belongs_to', {
                scenario_id: scenario_id,
                video_id: video.video_id
            }, 'video').then(function onSuccess() {

                $relationshipService.create('belongs_to', {
                    scenario_id: scenario_id,
                    location_id: video.location.location_id
                }, 'location').then(function onSuccess() {

                    // When there is no overlay for this video
                    callback();}
                )
            })
        };

        var counter = 0;
        var execute = function () {
            var length = $scope.newScenario.videos.length;
            if (counter < length) {
                createRelation($scope.newScenario.videos[counter], function () {
                    if (counter !== length - 1) {
                        counter++;
                        execute();
                    } else {
                        $scope.redirect('/scenarios/' + scenario_id);
                    }
                })
            }
        };
        execute();
    };

    /**
     *  Type Switching Functions
     */

    $scope.switchOverlayType = function () {
        if ($scope.existingOverlay) {
            $scope.existingOverlay = false;
        } else {
            $scope.searchOverlay();
            $scope.existingOverlay = true;
        }
    };

    $scope.switchVideoType = function () {
        if ($scope.existingVideo) {
            $scope.existingVideo = false;
            $scope.setupAddNewVideoMap()

        } else {
            $scope.existingVideo = true;
            $scope.setupAddExistingVideoMap();
        }
    };

    // Function to detect when file is selected at the new video upload process
    $scope.upload_change = function (evt) {
        if (evt.type === "change" || evt.type === "drop") {
            $scope.file_selected = true;
        }

        if (evt.type === "cleared") {
            $scope.file_selected = false;
        }
    };

    /**
     * 
     *  Validation Functions
     * 
     */

    $scope.validateScenario = function () {
        var name_input = angular.element('#name-input');
        var desc_input = angular.element('#desc-input');
        var tags_input = angular.element('#tags-input');

        var isValid = true;

        if ($scope.newScenario.name === "") {
            name_input.parent().parent().addClass('has-danger');
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newScenario.description === "") {
            desc_input.parent().parent().addClass('has-danger');
            desc_input.addClass('form-control-danger');
            isValid = false;
        }
        // Put tags in array
        if ($scope.newScenario.tags !== "" && $scope.newScenario.tags !== null) {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.newScenario.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) === "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.newScenario.tags_parsed = tagArray;
        }

        return isValid;
    };

    $scope.validateVideo = function () {

        var name_input = angular.element('#video_name-input');
        var desc_input = angular.element('#video_desc-input');
        var tags_input = angular.element('#video_tags-input');
        var recorded_input = angular.element('#video_recorded-input');

        var isValid = true;

        if ($scope.newVideo.name === "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newVideo.description === "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Put tags in array
        if ($scope.newVideo.tags !== "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.newVideo.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) === "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.newVideo.tags_parsed = tagArray;
        }

        if ($scope.newVideo.recorded !== null) {
            // Try to create a new date
            var created_date = new Date($scope.newVideo.recorded);

            // Check if it has been parsed correctly
            if (isNaN(created_date)) {
                recorded_input.parent().parent().addClass('has-danger');
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (created_date > new Date()) {
                recorded_input.parent().parent().addClass('has-danger');
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            recorded_input.parent().parent().addClass('has-danger');
            recorded_input.addClass('form-control-danger');
            isValid = false;
        }

        // Check if Location is valid and not on the 0:0-Island

        if ($scope.newVideo.location.lat === 0 || $scope.newVideo.location.lat === 0) {
            var lat_input = angular.element('#latitude');
            var lng_input = angular.element('#longitude');

            lat_input.parent().parent().addClass('has-danger');
            lng_input.parent().parent().addClass('has-danger');
            isValid = false;
        }

        if(Object.keys($scope.newVideo.location).length === 0){
            $window.alert('Please select a Location before starting the upload!');
            isValid = false;
        }
        return isValid;
    }

    /**
     * 
     *  Map Settings & setUp functions
     *  Search functions also included!
     * 
     */

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

    // Existing location selected out of the list
    $scope.clickLocation = function(location){
        $scope.newVideo.location.lat = location.lat;
        $scope.newVideo.location.lng = location.lng;
        $scope.newVideo.location.name = location.name;
        $scope.newVideo.location.location_id = location.location_id;
        $scope.newVideo.location.location_type = location.location_type;
        $scope.existingLocation = true;
    };

    $scope.setupAddNewVideoMap = function () {
        var locationMarkers = [];
        $scope.locationIndoor = [];
        $scope.locationCoord = [];
        // Get all locations and create markers for them;
        $locationService.list()
            .then(function onSuccess(response) {
                response.data.forEach(function (location) {
                    // Exclude indoor locations and those which are wrongly located at 0/0
                    if (location.location_type !== "indoor" && location.lat !== null && location.lng !== null) {

                        // locations.push(location);
                        var markerOptions = {
                            clickable: true
                        };

                        var popupContent = `Location: ${location.name}`;
                        var marker = new L.Marker(L.latLng(location.lat, location.lng), markerOptions).bindPopup(popupContent);
                        marker.on('click', function (e) {
                            $scope.newVideo.location.lat = e.latlng.lat;
                            $scope.newVideo.location.lng = e.latlng.lng;
                            $scope.newVideo.location.name = location.name;
                            $scope.newVideo.location.location_id = location.location_id;
                            $scope.newVideo.location.location_type = location.location_type;
                            $scope.existingLocation = true;

                        });
                        locationMarkers.push(marker);
                        $scope.locationCoord.push(location);
                    }
                    else{
                        $scope.locationIndoor.push(location);
                    }
                }, this);

            leafletData.getMap('addNewVideoMap').then(function (map) {
                // Clear map first;
                if ($scope.featureGroup !== null) {
                    map.removeLayer($scope.featureGroup);
                }

                $scope.featureGroup = L.featureGroup(locationMarkers).addTo(map);
                map.fitBounds($scope.featureGroup.getBounds(), {
                    animate: false,
                    padding: L.point(50, 50)
                });

                // Add colored marker to the center
                var myIcon = new L.Icon({
                    iconUrl: 'images/customMarker.png',
                    iconRetinaUrl: 'images/customMarker@2x.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })

                var ownMarkerOptions = {
                    icon: myIcon,
                    draggable: true,
                    riseOnHover: true
                }

                var ownMarker = new L.Marker(map.getCenter(), ownMarkerOptions);

                ownMarker.on('dragend', function (e) {
                    //Clear to have a clean new location
                    $scope.newVideo.location = {};
                    $scope.newVideo.location.lat = e.target._latlng.lat;
                    $scope.newVideo.location.lng = e.target._latlng.lng;
                    $scope.existingLocation = false;
                })

                var popupContent = 'Drag this marker to select a new Location!';
                ownMarker.addTo(map);
            })

            /**
             * Search Function for the locations
             */

            $scope.searchLocation = function () {

                var searchLocationMarkers = [];
                response.data.forEach(function (location) {
                    if ($scope.searchLocationTerm == "") {
                        if (location.location_type !== "indoor" && location.lat !== null && location.lng !== null) {
                            var markerOptions = {
                                clickable: true
                            }
                            var popupContent = `Location: ${location.name}`;
                            var marker = new L.Marker(L.latLng(location.lat, location.lng), markerOptions).bindPopup(popupContent);
                            marker.on('click', function (e) {
                                $scope.newVideo.location.lat = e.latlng.lat;
                                $scope.newVideo.location.lng = e.latlng.lng;
                                $scope.newVideo.location.name = location.name;

                                $scope.newVideo.location.location_id = location.location_id;
                                $scope.existingLocation = true;

                            })
                            searchLocationMarkers.push(marker);
                        }

                    }

                    if (location.name.search($scope.searchLocationTerm) != -1) {

                        var popupContent = `Location: ${location.name}`;
                        var marker = new L.Marker(L.latLng(location.lat, location.lng), {
                            clickable: true
                        }).bindPopup(popupContent);
                        marker.on('click', function (e) {
                            $scope.newVideo.location.lat = e.latlng.lat;
                            $scope.newVideo.location.lng = e.latlng.lng;
                            $scope.newVideo.location.name = location.name;
                            $scope.newVideo.location.location_id = location.location_id;
                            $scope.existingLocation = true;
                        })

                        searchLocationMarkers.push(marker);
                    }

                }, this);

                // Clear map and add new featureGroup with searchResults
                leafletData.getMap('addNewVideoMap').then(function (map) {

                    map.removeLayer($scope.featureGroup);
                    $scope.featureGroup = L.featureGroup(searchLocationMarkers).addTo(map);
                    map.fitBounds($scope.featureGroup.getBounds(), {
                        animate: false,
                        padding: L.point(50, 50)
                    });

                })


            }
        });
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
                $scope.existingVideo = true;
            }
        }
    };

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
                                    };
                                    $scope.existingVideo = true;
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
                                    if ($scope.featureGroup !== null) {
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
                            if (relation.location_type !== "indoor" && relation.location_lat !== 0 && relation.location_lng !== 0) {


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