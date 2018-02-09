var app = angular.module("ive_cms");

app.controller("scenarioCreateNewController", function ($scope, config, $authenticationService, $locationService, $relationshipService, $scenarioService, $videoService, $overlayService, $location, $document, leafletData, Upload, $sce, $rootScope, $window) {

    $scope.currentState = {
        general: true, // General Information Input Screen
        addVideo: false, // Screen where a new video is created
        scenarioVideoOverview: false, // Overview over the scenario's videos
        createOverlay: false, // Overlay creation
        placeOverlay: false, // Overlay placement
        finishScenario: false // Scenario finish Screen
    };

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
    }

    var scenarioCreated = false;

    // Authenticate with the backend to get permissions to create content
    $authenticationService.authenticate(config.backendLogin)
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

    // Method to sumbit the general Scenario information, send it to the
    // server and handle the created object
    $scope.submitGeneral = function () {
        if ($scope.validateScenario() == true && !scenarioCreated) {

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
    }

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
        }

        $scope.featureGroup = null;
        $scope.uploadStarted = false;
        $scope.file_selected = false;

        $scope.setupAddNewVideoMap();
    }

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

    }

    /**
     * Main Video Upload Function
     */

    $scope.uploadVideo = function () {

        var startUpload = function () {
            Upload.upload({
                    url: '/cms/videos/upload',
                    data: uploadVideoData
                })
                .progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                    $scope.uploadStatus.currentPercentage = progressPercentage;
                    $scope.uploadStatus.loaded = evt.loaded;
                    $scope.uploadStatus.total = evt.total;

                    angular.element('.progress-bar').attr('aria-valuenow', progressPercentage).css('width', progressPercentage + '%');
                })
                .success(function (data, status, headers, config) {
                    console.log("Upload finished! Creating Thumbnail now...");

                    $videoService.create({
                        name: $scope.newVideo.name,
                        description: $scope.newVideo.description,
                        url: '/' + data.url.split('/public/')[1],
                        recorded: $scope.newVideo.recorded
                    }).then(function (createdVideo) {

                        if (createdVideo.status != 201) {
                            $window.alert('It seems like the backend is not responding. Please try again later.');
                            return;
                        }

                        // Create relationship between location and the new video
                        var recorded_at = {
                            video_id: createdVideo.data.video_id,
                            location_id: newLocation.location_id,
                            preferred: false // What does this parameter do?
                        }

                        $relationshipService.create('recorded_at', recorded_at).then(function (createdRelation) {
                            if (createdVideo.status == 201) {
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
        }

        var newLocation;
        $scope.uploadStarted = true;
        $scope.uploadStatus = {
            currentPercentage: 0,
            loaded: 0,
            total: 0
        }

        var uploadVideoData = {
            file: $scope.uploadingVideo
        }

        if ($scope.existingLocation) {
            uploadVideoData.location = {
                existing_name: $scope.newVideo.location.name,
                newVideo: $scope.newVideo
            };
            newLocation = $scope.newVideo.location;
            startUpload();
        } else {
            $scope.newVideo.location.location_type = "outdoor";
            // Create location
            $locationService.create($scope.newVideo.location)
                .then(function (response) {
                    if (response.status != 201) {
                        $window.alert('It seems like the backend is not responding. Please try again later.');
                        return;
                    }
                    $scope.newVideo.location = response.data;
                    newLocation = response.data;
                    uploadVideoData.location = {
                        newLocation: $scope.newVideo.location,
                        newVideo: $scope.newVideo
                    }
                    startUpload();
                });
        }
    }

    $scope.removeTempVideo = function(index){
        $scope.newScenario.videos.splice(index, 1);
    }

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
    }

    $scope.createOverlay = function () {

        if ($scope.newScenario.videos.length == 0) {
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
        if (videoExtension == null) {
            videoExtension = 'mp4';
            $scope.currentVideo.thumbnail_url = $scope.currentVideo.url + '_thumbnail.png';
            $scope.currentVideo.url += '.mp4';
        }

        // Init with the first Video
        $scope.videoConfig = {
            sources: [{
                src: $sce.trustAsResourceUrl($scope.currentVideo.url),
                type: "video/" + videoExtension
            }],
            tracks: [],
            theme: "../bower_components/videogular-themes-default/videogular.css"
        }

        // Variable to indicate wether to add an existing or a new overlay
        $scope.existingOverlay = false;
        $scope.existingOverlayId = null;

        $scope.newOverlay = {
            name: "",
            description: "",
            tags: [],
            category: "",
            url: ""
        }

        $scope.searchOverlay = function () {
            $overlayService.list().then(function (response) {
                var overlays = response.data;
                $scope.overlaySearchResults = [];

                if ($scope.searchOverlayTerm == "") {
                    // Add the first 5 Results to fill the space
                    $scope.overlaySearchResults = [response.data[0], response.data[1], response.data[2], response.data[3], response.data[4]];
                }
                overlays.forEach(function (overlay) {
                    if (overlay.name.search($scope.searchOverlayTerm) != -1) {
                        $scope.overlaySearchResults.push(overlay);
                    }
                }, this);

            })
        }


        // Function that is called in the table of existing overlays
        $scope.selectOverlay = function (overlay) {
            $scope.selectedOverlay = overlay;
        }
    }

    // Function that is called when no Overlay wants to be added
    $scope.skipVideo = function () {

        // If it was the last video set the state to finishScenario
        if ($scope.currentVideoIndex == $scope.newScenario.videos.length - 1) {
            $scope.currentState.createOverlay = false;
            $scope.currentState.finishScenario = true;
        } else {
            $scope.currentVideoIndex++;
            $scope.currentVideo = $scope.newScenario.videos[$scope.currentVideoIndex];
            var videoExtension = $scope.currentVideo.url.split('.')[1];

            // Wenn keine extension in der URL war..
            if (videoExtension == null) {
                videoExtension = 'mp4';
                $scope.currentVideo.thumbnail_url = $scope.currentVideo.url + '_thumbnail.png';
                $scope.currentVideo.url += '.mp4';
            }
            // Change Video Preview
            $scope.videoConfig.sources = [{
                src: $sce.trustAsResourceUrl($scope.currentVideo.url),
                type: "video/" + videoExtension
            }];
        }
    }

    $scope.submitOverlay = function () {
        // Add an overlay to the video
        var validateOverlay = function () {

            var name_input = angular.element('#overlay_name-input');
            var desc_input = angular.element('#overlay_desc-input');
            var tags_input = angular.element('#overlay_tags-input');
            var url_input = angular.element('#overlay_url-input');

            var isValid = true;

            if ($scope.newOverlay.name == "") {
                name_input.parent().parent().addClass('has-danger')
                name_input.addClass('form-control-danger');
                isValid = false;
            }

            if ($scope.newOverlay.description == "") {
                desc_input.parent().parent().addClass('has-danger')
                desc_input.addClass('form-control-danger');
                isValid = false;
            }

            // Put tags in array
            if ($scope.newOverlay.tags != "") {
                // Parse array, grab them by the comma and remove the #
                var tagArray = [];
                $scope.newOverlay.tags.split(', ').forEach(function (element) {
                    if (element.charAt(0) == "#") {
                        tagArray.push(element.slice(1));
                    }
                }, this);
                $scope.newOverlay.tags_parsed = tagArray;
            }

            if ($scope.newOverlay.url == "") {
                desc_input.parent().parent().addClass('has-danger')
                desc_input.addClass('form-control-danger');
                isValid = false;
            }

            if (isValid) {
                return true;
            } else {
                return false;
            }
        }

        if ($scope.existingOverlay) {
            // Retrieve the existing overlay and attach it to the video
            $scope.newScenario.videos[$scope.currentVideoIndex].overlay = $scope.selectedOverlay;
            $scope.placeOverlay($scope.currentVideo.overlay);
        } else {
            // Create new Overlay and attach the newly created to the video
            if (validateOverlay()) {
                if (!$scope.newOverlay.category) {
                    $scope.newOverlay.category = "other"
                }
                $overlayService.create($scope.newOverlay).then(function (created_overlay) {
                    $scope.newScenario.videos[$scope.currentVideoIndex].overlay = created_overlay.data;
                    // Switch to Overlay Placement Screen
                    $scope.placeOverlay(created_overlay);
                })
            } else {
                return;
            }
        }
    }

    /**
     * 
     * =============
     * To be implemented
     * =============
     * 
     */
    // Placement of an Overlay
    // To be adpoted from the IPED-Toolkit
    $scope.placeOverlay = function (currentOverlay) {
        $scope.currentState.createOverlay = false;
        $scope.currentState.placeOverlay = true;

        $scope.positioningOverlay = currentOverlay;


        // At the end: Set state to createOverlay, increase index++ and set $scope.currentVideo if it's not the last video
        // If it's the last video set state to finishScenario

    }

    $scope.submitOverlayRotation = function () {

        /**
         *  
         * =============
         * To be implemented:
         * =============
         * 
         * Create embedded_in relation for $scope.currentVideo.overlay and $scope.currentVideo here.
         * This relation needs to contain the rotational parameters, which need to be calculated / extracted
         * from three.js.
         * 
         */

        // Faking it for now..

        console.log('Faking overlay rotation');
        overlayRotation = {
            overlay_id: $scope.currentVideo.overlay.overlay_id,
            video_id: $scope.currentVideo.video_id,
            w: 0,
            h: 0,
            d: 0,
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0,
            display: true
        };

        $scope.newScenario.videos[$scope.currentVideoIndex].overlay.rotation = overlayRotation;

        if ($scope.currentVideoIndex == $scope.newScenario.videos.length - 1) {
            $scope.currentState.placeOverlay = false;
            $scope.currentState.finishScenario = true;
        } else {
            $scope.currentVideoIndex++;
            $scope.currentVideo = $scope.newScenario.videos[$scope.currentVideoIndex];

            var videoExtension = $scope.currentVideo.url.split('.')[1];

            // Wenn keine extension in der URL war..
            if (videoExtension == null) {
                videoExtension = 'mp4';
                $scope.currentVideo.thumbnail_url = $scope.currentVideo.url + '_thumbnail.png';
                $scope.currentVideo.url += '.mp4';
            }
            // Adjust implemented video url
            $scope.videoConfig.sources = [{
                src: $sce.trustAsResourceUrl($scope.currentVideo.url),
                type: "video/" + videoExtension
            }];

            $scope.currentState.placeOverlay = false;
            $scope.currentState.createOverlay = true;
        }
    }

    $scope.finishScenario = function () {
        $scope.submitScenario();
    }

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

                    if (video.overlay) {
                        $relationshipService.create('belongs_to', {
                            scenario_id: scenario_id,
                            overlay_id: video.overlay.overlay_id
                        }, 'overlay').then(function onSuccess() {
                            $relationshipService.create('embedded_in', video.overlay.rotation)
                                .then(function onSuccess() {
                                    callback();
                                })
                        })
                    } else {
                        // When there is no overlay for this video
                        callback();
                    }
                })
            })
        }

        var counter = 0;
        var execute = function () {
            var length = $scope.newScenario.videos.length;
            if (counter < length) {
                createRelation($scope.newScenario.videos[counter], function () {
                    if (counter != length - 1) {
                        counter++
                        execute();
                    } else {
                        $scope.redirect('/scenarios/' + scenario_id);
                    }
                })
            }
        }
        execute();
    }

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
    }

    $scope.switchVideoType = function () {
        if ($scope.existingVideo) {
            $scope.existingVideo = false;
            $scope.setupAddNewVideoMap()

        } else {
            $scope.existingVideo = true;
            $scope.setupAddExistingVideoMap();
        }
    }

    // Function to detect when file is selected at the new video upload process
    $scope.upload_change = function (evt) {
        if (evt.type == "change" || evt.type == "drop") {
            $scope.file_selected = true;
        }

        if (evt.type == "cleared") {
            $scope.file_selected = false;
        }
    }

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

        if ($scope.newScenario.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newScenario.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }
        // Put tags in array
        if ($scope.newScenario.tags != "" && $scope.newScenario.tags != null) {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.newScenario.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.newScenario.tags_parsed = tagArray;
        }

        return isValid;
    }

    $scope.validateVideo = function () {

        var name_input = angular.element('#video_name-input');
        var desc_input = angular.element('#video_desc-input');
        var tags_input = angular.element('#video_tags-input');
        var recorded_input = angular.element('#video_recorded-input');

        var isValid = true;

        if ($scope.newVideo.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newVideo.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        // Put tags in array
        if ($scope.newVideo.tags != "") {
            // Parse array, grab them by the comma and remove the #
            var tagArray = [];
            $scope.newVideo.tags.split(', ').forEach(function (element) {
                if (element.charAt(0) == "#") {
                    tagArray.push(element.slice(1));
                }
            }, this);
            $scope.newVideo.tags_parsed = tagArray;
        }

        if ($scope.newVideo.recorded != null) {
            // Try to create a new date
            var created_date = new Date($scope.newVideo.recorded);

            // Check if it has been parsed correctly
            if (isNaN(created_date)) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (created_date > new Date()) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            recorded_input.parent().parent().addClass('has-danger')
            recorded_input.addClass('form-control-danger');
            isValid = false;
        }

        // Check if Location is valid and not on the 0:0-Island

        if ($scope.newVideo.location.lat == 0 || $scope.newVideo.location.lat == 0) {
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

    $scope.setupAddNewVideoMap = function () {
        var locationMarkers = [];
        // Get all locations and create markers for them;
        $locationService.list().then(function onSuccess(response) {
            response.data.forEach(function (location) {
                // Exclude indoor locations and those which are wrongly located at 0/0
                if (location.location_type != "indoor" && location.lat != 0 && location.lng != 0) {

                    // locations.push(location);
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
                    locationMarkers.push(marker);
                }
            }, this);

            leafletData.getMap('addNewVideoMap').then(function (map) {
                // Clear map first;
                if ($scope.featureGroup != null) {
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
                        if (location.location_type != "indoor" && location.lat != 0 && location.lng != 0) {
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
    }

    $scope.setupAddExistingVideoMap = function () {

        var videoMarkers = [];

        $videoService.list().then(function (videos) {
            // Get recorded_At relations
            $relationshipService.list_by_type('recorded_at').then(function (relations) {

                // create markers from recorded at relation when video.video_id relation.video_id matches
                videos.data.forEach(function (video, video_index) {

                    relations.data.forEach(function (relation) {
                        if (video.video_id == relation.video_id) {

                            // We dont want to display indoor locations
                            if (relation.location_type != "indoor" && relation.location_lat != 0 && relation.location_lng != 0) {

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
                                    $scope.newVideo = video;
                                    $scope.newVideo.location = {
                                        lat: relation.location_lat,
                                        lng: relation.location_lng,
                                        location_id: relation.location_id
                                    }
                                    $scope.existingVideo = true;
                                })
                                videoMarkers.push(marker);
                            }

                            if (video_index == videos.data.length - 1) {
                                leafletData.getMap('addExistingVideoMap').then(function (map) {
                                    // Clear map first;
                                    if ($scope.featureGroup != null) {
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
                        if ($scope.searchVideoTerm == "") {
                            if (relation.location_type != "indoor" && relation.location_lat != 0 && relation.location_lng != 0) {


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