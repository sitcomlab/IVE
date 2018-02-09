var app = angular.module("ive_cms");

app.controller("locationDetailController", function ($scope, $rootScope, $routeParams, $window, config, $location, $authenticationService, $relationshipService, $locationService, leafletData, $route) {

    // $scope.active = "scenarios";
    $scope.subsite = "detail";

    var locationMarkers = [];
    $scope.location = null;

    $scope.createConnection = false;

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

    // Init: Get Location from $locationService
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
    
    $locationService.retrieve($routeParams.location_id).then(function onSuccess(location) {
        $scope.location = location.data;
        $rootScope.currentSite = "Location: '"+ $scope.location.name + "'";

        leafletData.getMap('locationDetailMap').then(function (map) {
            var popupContent = `Location: ${$scope.location.location_name}`;
            var marker = new L.Marker(new L.latLng($scope.location.lat, $scope.location.lng)).bindPopup(popupContent);
            marker.addTo(map);
            map.setView(marker._latlng, 14);
        })
        // Get connected_to relations

        $relationshipService.list_by_type('connected_to').then(function onSuccess(relations) {
            $scope.location.connections = {
                ingoing: [],
                outgoing: []
            }

            relations.data.forEach(function (relation) {
                if (relation.start_location_id == $scope.location.location_id) $scope.location.connections.outgoing.push(relation);
                if (relation.end_location_id == $scope.location.location_id) $scope.location.connections.ingoing.push(relation);
            }, this);
        })

    })

    $scope.deleteLocation = function () {
        // Delete the location with location.id

        if ($window.confirm(`You are going to delete the Location ${$scope.location.name}. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                $locationService.remove($scope.location.location_id).then(function onSuccess(response) {
                    // Delete any relation to the location
                    $relationshipService.list_by_type('recorded_at').then(function onSuccess(response) {
                        var relations = response.data;
                        relations.forEach(function (relation) {
                            if (relation.location_id == $scope.location.location_id) {
                                $relationshipService.remove(relation.relationship_id);
                            }
                        }, this);
                    });

                    $relationshipService.list_by_type('connected_to').then(function onSuccess(response) {
                        var relations = response.data;
                        relations.forEach(function (relation) {
                            if (relation.start_location_id == $scope.location.location_id || relation.end_location_id == $scope.location.location_id) {
                                $relationshipService.remove(relation.relationship_id);
                            }
                        }, this);

                        $scope.redirect('/locations');
                    });
                })
            }
        }
    }


    $scope.editLocation = function () {
        if ($scope.editMode) {
            $scope.editMode = false;
            $scope.createConnection = false;
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
        if ($scope.location.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.location.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        return isValid;

    }

    $scope.saveLocation = function () {
        if (validate()) {
            var location_id = $scope.location.location_id
            var edited_location = {
                name: $scope.location.name,
                description: $scope.location.description,
                lat: $scope.location.lat,
                lng: $scope.location.lng,
                location_type: "outdoor"
            }

            $locationService.edit(location_id, edited_location).then(function onSuccess(response) {
                $route.reload();
            })

        }
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
        if ($window.confirm(`You are going to delete the Location ${$scope.location.name}. Are you sure? THIS WILL NOT BE REVERSIBLE!`)) {
            if ($window.confirm('Are you really, really sure?')) {
                $relationshipService.remove(connection_id).then(function onSuccess(response) {
                    $route.reload();
                })
            }
        }
    }

    $scope.newConnection = function (type) {
        $scope.createConnection = true;
        $scope.selectedLocation = null;
        // Get all locations

        $locationService.list().then(function onSuccess(response) {

            $scope.locations = response.data;

        })

        if (type == 'ingoing') {
            $scope.connectiontype = 'ingoing';
        } else {
            $scope.connectiontype = 'outgoing';
        }

    }
    // Use $relationshipService to create the connection
    $scope.submitConnection = function () {

        if ($scope.selectedLocation == null) return;

        if ($scope.connectiontype == 'ingoing') {
            // newloc --> location
            $relationshipService.create('connected_to', {
                start_location_id: $scope.selectedLocation.location_id,
                end_location_id: $scope.location.location_id,
                weight: 1
            }).then(function onSuccess(response) {
                $route.reload();
                return;
            })

        } else {
            // location --> newLoc
            $relationshipService.create('connected_to', {
                start_location_id: $scope.location.location_id,
                end_location_id: $scope.selectedLocation.location_id,
                weight: 1
            }).then(function onSuccess(response) {
                $route.reload();
                return;
            })
        }
    }
    $scope.selectLocation = function (location) {
        $scope.selectedLocation = location;
    }
});