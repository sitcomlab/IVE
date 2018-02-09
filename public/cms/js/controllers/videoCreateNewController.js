var app = angular.module("ive_cms");

app.controller("videoCreateNewController", function ($scope, $rootScope, config, $location, $authenticationService, $videoService, $locationService, $relationshipService, $document, $window, Upload, leafletData) {

    $scope.file_selected = false;

    $scope.newVideo = {
        name: "",
        description: "",
        tags: "",
        recorded: "",
        location: {
            name: "",
            description: "",
            lng: 0,
            lat: 0
        }
    }

    $rootScope.currentCategory = "Videos";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/videos');
    }
    $rootScope.currentSite = "Create new video";


    // Input fields
    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var tags_input = angular.element('#tags-input');
    var recorded_input = angular.element('#recorded-input');

    // Boolean indicating if the forms are valid
    var isValid = null;

    // Leaflet Map Init
    var locations = [];
    var locationMarkers = [];
    var featureGroup;
    var location_id;
    var location_name;


    // Authenticate with the backend to get permissions to create content

    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });


    $locationService.list().then(function onSuccess(response) {
        response.data.forEach(function (location) {
            // Exclude indoor locations and those which are wrongly located at 0/0
            if (location.location_type != "indoor" && location.lat != 0 && location.lng != 0) {

                locations.push(location);
                var markerOptions = {
                    clickable: true
                }

                var popupContent = `Location: ${location.name}`;
                var marker = new L.Marker(L.latLng(location.lat, location.lng), markerOptions).bindPopup(popupContent);
                marker.on('click', function (e) {
                    $scope.newVideo.location.lat = e.latlng.lat;
                    $scope.newVideo.location.lng = e.latlng.lng;
                    // $scope.newVideo.location.l_id = location.l_id;
                    $scope.newVideo.location.name = location.name;

                    location_id = location.location_id;

                    $scope.newLocation = location;
                    $scope.createLocation = false;

                })
                locationMarkers.push(marker);
            }
        }, this);

        leafletData.getMap('addNewVideoMap').then(function (map) {

            featureGroup = L.featureGroup(locationMarkers).addTo(map);
            map.fitBounds(featureGroup.getBounds(), {
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
                $scope.createLocation = true;
            })

            var popupContent = 'Drag this marker to select a new Location!';
            ownMarker.addTo(map);
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


    $scope.searchLocation = function () {

        var searchTerm = $scope.searchTerm;

        var SearchMarkers = [];

        locations.forEach(function (location) {


            if (searchTerm == "") {

                var popupContent = `Location: ${location.name}`;
                var marker = new L.Marker(L.latLng(location.lat, location.lng), {
                    clickable: true
                }).bindPopup(popupContent);
                marker.on('click', function (e) {
                    $scope.newVideo.location.lat = e.latlng.lat;
                    $scope.newVideo.location.lng = e.latlng.lng;
                    // $scope.newVideo.location.l_id = location.l_id;
                    $scope.newLocation = location;

                    location_id = location.location_id;

                    $scope.createLocation = false;

                })

                SearchMarkers.push(marker);

            }

            if (location.name.search(searchTerm) != -1) {

                var popupContent = `Location: ${location.name}`;
                var marker = new L.Marker(L.latLng(location.lat, location.lng), {
                    clickable: true
                }).bindPopup(popupContent);
                marker.on('click', function (e) {
                    $scope.newVideo.location.lat = e.latlng.lat;
                    $scope.newVideo.location.lng = e.latlng.lng;
                    // $scope.newVideo.location.l_id = location.l_id;
                    $scope.newLocation = location;
                    location_id = location.location_id;

                    $scope.createLocation = false;

                })

                SearchMarkers.push(marker)
            }
        }, this);


        leafletData.getMap('addNewVideoMap').then(function (map) {
            // Clear the map
            map.removeLayer(featureGroup);

            featureGroup = L.featureGroup(SearchMarkers).addTo(map);

        });
    }

    $scope.submit = function () {

        isValid = true;

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

        // Validate the input for the date and parse it
        if ($scope.newVideo.recorded != "") {

            // Try to create a new date
            var recorded_date = new Date($scope.newVideo.recorded);

            // Check if it has been parsed correctly
            if (isNaN(recorded_date)) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

            // Catch dates in the future...
            if (recorded_date > new Date()) {
                recorded_input.parent().parent().addClass('has-danger')
                recorded_input.addClass('form-control-danger');
                isValid = false;
            }

        } else {
            recorded_input.parent().parent().addClass('has-danger')
            recorded_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newVideo.location.lat == 0 || $scope.newVideo.location.lng == 0) {
            isVaild = false;
            alert("Please select a location!");
        }

        // Check if file has been selected
        if (isValid && $scope.uploadingVideo != null) {
            $scope.upload();
        }



    }

    $scope.upload_change = function (evt) {
        if (evt.type == "change" || evt.type == "drop") {
            $scope.file_selected = true;
        }

        if (evt.type == "cleared") {
            $scope.file_selected = false;
        }
    }

    // Accept Uploaded files and send them to the backend server
    // TODO: Think about how the videos are ordered on the fs --> create location
    // before the upload is initialised

    // Bool to see if we need to create a new location
    $scope.createLocation = false;

    $scope.newLocation = {
        name: "",
        description: "",
        location_type: "outdoor",
        lng: null,
        lat: null,
    }


    $scope.upload = function () {

        // Check where to upload the file..
        // if ($scope.newVideo.location.l_id) {
        if (!$scope.createLocation) {
            // location_id = $scope.newVideo.location.l_id;
            location_name = $scope.newVideo.location.name;
        } else {
            // New Location needs to be created
            $scope.newLocation.lng = $scope.newVideo.location.lng;
            $scope.newLocation.lat = $scope.newVideo.location.lat;

            $scope.createLocation = true;
            $locationService.create($scope.newLocation)
                .then(function (response) {

                    if (response.status != 201) {
                        $window.alert('It seems like the backend is not responding. Please try again later.');
                        return;
                    }

                    $scope.newLocation = response.data;
                });
        }

        $scope.uploadStarted = true;

        console.log("Uploading...");

        // Get location if existing or create a new one...
        $scope.uploadStatus = {
            currentPercentage: 0,
            loaded: 0,
            total: 0
        }

        var uploadVideoData = {
            file: $scope.uploadingVideo
        }

        if ($scope.createLocation) {
            uploadVideoData.location = {
                newLocation: $scope.newLocation,
                newVideo: $scope.newVideo
            }
        } else {
            uploadVideoData.location = {
                existing_name: location_name,
                newVideo: $scope.newVideo
            }
        }

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
                        location_id: $scope.newLocation.location_id,
                        preferred: false //What does this parameter do?
                    }

                    $relationshipService.create('recorded_at', recorded_at).then(function (createdRelation) {
                        if (createdVideo.status == 201) {
                            $scope.redirect('/videos/' + createdVideo.data.video_id);
                        }

                    })

                })



            })
            .error(function (data, status, headers, config) {
                console.log('error status: ' + status);
            })
    }





    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

});