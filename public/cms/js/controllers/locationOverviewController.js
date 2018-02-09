var app = angular.module("ive_cms");

app.controller("locationOverviewController", function ($scope, $rootScope, $window, config, $location, $authenticationService, $relationshipService, $locationService, leafletData, $route) {

    // $scope.active = "scenarios";
    $scope.subsite = "overview";
    $scope.mapView = true;

    var locationMarkers = [];
    var locationFeatureGroup;
    $scope.clickedMarker = null;
    $scope.locations;

    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var lng_input = angular.element('#lng-input');
    var lat_input = angular.element('#lat-input');

    $rootScope.currentCategory = "Locations";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/locations');
    }
    $rootScope.currentSite = null;


    // Authenticate with the backend to get permissions to delete and modify content
    $authenticationService.authenticate(config.backendLogin)
        .then(function onSuccess(response) {
            $authenticationService.set(response.data);
        })
        .catch(function onError(response) {
            $window.alert(response.data);
        });

    // Setup Map Options
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

    $locationService.list().then(function onSuccess(response) {

        // Create Marker for every location and add it to the markers array

        $scope.locations = response.data;

        $relationshipService.list_by_type('connected_to').then(function onSuccess(relations) {
            $scope.connections = relations.data;
        })


        $scope.locations.forEach(function (location) {

            // Draw them on the map
            if (location.lat != 0 && location.lng != 0) {
                var coords = new L.latLng(location.lat, location.lng);
                var popupContent = `Location: ${location.name}<br>
                Description: ${location.description}`
                var marker = new L.Marker(coords, {
                    clickable: true
                }).bindPopup(popupContent);

                marker.on('click', function (e) {
                    $scope.redirect(`/locations/${location.location_id}`);
                })

                locationMarkers.push(marker);

            }
        }, this);

        leafletData.getMap('locationOverviewMap').then(function (map) {
            featureGroup = new L.featureGroup(locationMarkers).addTo(map);
            map.fitBounds(featureGroup.getBounds(), {
                animate: false,
                // padding: L.point(50, 50)
            })

        });
    });

    $scope.deleteLocation = function () {
        // Delete the location with clickedMarker.id

        if ($window.confirm(`You are going to delete the Location ${$scope.clickedMarker.name}. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                $locationService.remove($scope.clickedMarker.id).then(function onSuccess(response) {


                    // Delete any relation to the location

                    $relationshipService.list_by_type('recorded_at').then(function onSuccess(response) {

                        var relations = response.data;

                        relations.forEach(function (relation) {

                        }, this);

                        $route.reload();

                    });

                    // What do we do with the connected_to relations??




                })
            }
        }

    }


    $scope.editLocation = function () {
        if ($scope.editMode) {
            $scope.editMode = false;
            name_input.prop('disabled', true);
            desc_input.prop('disabled', true);
            lat_input.prop('disabled', true);
            lng_input.prop('disabled', true);
        } else {
            $scope.editMode = true;
            // Enable input Fields
            angular.element('.col-10 > .form-control').removeAttr('disabled');
        }
    }

    var validate = function () {

        isValid = true;

        if ($scope.clickedMarker.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.clickedMarker.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        return isValid;

    }

    $scope.saveLocation = function () {

        if (validate) {

            var location_id = $scope.clickedMarker.id

            var edited_location = {
                name: $scope.clickedMarker.name,
                description: $scope.clickedMarker.description,
                lat: $scope.clickedMarker._latlng.lat,
                lng: $scope.clickedMarker._latlng.lng,
                location_type: "outdoor"
            }

            $locationService.edit(location_id, edited_location).then(function onSuccess(response) {
                $route.reload();
            })

        }
    }

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function (path) {
        $location.url(path);
    };

    $scope.search = function () {
        $locationService.list()
            .then(function onSuccess(response) {
                var allLocations = response.data;
                var searchResults = [];
                if ($scope.searchTerm != null && $scope.searchTerm != "") {
                    var normalized = $scope.searchTerm.toLowerCase();
                    for (var i = 0; i < allLocations.length; i++) {
                        var match = false;
                        var current_location = allLocations[i];
                        if (current_location.name != null && current_location.description != null) {
                            if (current_location.name.toLowerCase().search('(' + normalized + ')') != -1) match = true;
                            if (current_location.description.toLowerCase().search('(' + normalized + ')') != -1) match = true;
                            if (match) searchResults.push(current_location);
                        }
                    }
                    $scope.locations = searchResults;
                    // Init redrawing of the map --> clear featuregroup, create new markers ...
                } else {
                    $scope.locations = allLocations;
                }

                locationMarkers = [];
                $scope.locations.forEach(function (location) {

                    if (location.lat != 0 && location.lng != 0) {
                        var coords = new L.latLng(location.lat, location.lng);
                        var popupContent = `Location: ${location.name}<br>
                Description: ${location.description}`
                        var marker = new L.Marker(coords, {
                            clickable: true
                        }).bindPopup(popupContent);

                        marker.on('click', function (e) {
                            // $scope.clickedMarker = marker;
                            // $scope.clickedMarker.name = location.name;
                            // $scope.clickedMarker.description = location.description;
                            // $scope.clickedMarker.id = location.location_id;
                            // $scope.clickedMarker.connections = getConnections(location.location_id);
                            $scope.redirect(`/locations/${location.location_id}`);

                        })
                        locationMarkers.push(marker);
                    }
                }, this);

                leafletData.getMap('locationOverviewMap').then(function (map) {
                    map.removeLayer(featureGroup);
                    featureGroup = new L.featureGroup(locationMarkers).addTo(map);
                    map.fitBounds(featureGroup.getBounds(), {
                        animate: false,
                        // padding: L.point(50, 50)
                    })
                });
            })
    }

    var getConnections = function (location_id) {
        var ingoing = [];
        var outgoing = [];
        $scope.connections.forEach(function (connection) {
            if (connection.start_location_id == location_id) outgoing.push(connection);
            if (connection.end_location_id == location_id) ingoing.push(connection);
        }, this);
        return {
            ingoing: ingoing,
            outgoing: outgoing
        };
    }

    $scope.deleteConnection = function (connection_id) {

        if ($window.confirm(`You are going to delete the Location ${$scope.clickedMarker.name}. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                 $relationshipService.remove(connection_id).then(function onSuccess(response) {
                     console.log(response);
                 })
                console.log('Connection deleted;')
            }
        }
    }


});