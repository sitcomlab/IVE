app.controller("locationCreateNewController", function ($scope, $rootScope, $window, config, $location, $authenticationService, $relationshipService, $locationService, leafletData) {

    var name_input = angular.element('#name-input');
    var desc_input = angular.element('#desc-input');
    var lng_input = angular.element('#lng-input');
    var lat_input = angular.element('#lat-input');

    $rootScope.currentCategory = "Locations";
    $rootScope.redirectBreadcrumb = function () {
        $location.url('/locations');
    }
    $rootScope.currentSite = "Create new location";


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

    $scope.newLocation = {
        name: "",
        description: "",
        tags: [],
        lat: 0,
        lng: 0,
        location_type: 'outdoor'
    }

    leafletData.getMap('locationCreateNewMap').then(function (map) {
        var marker = new L.Marker(map.getCenter(), {
            draggable: true
        });

        marker.on('dragend', function (e) {
            $scope.newLocation.lat = marker._latlng.lat;
            $scope.newLocation.lng = marker._latlng.lng;
        })

        marker.addTo(map);
        map.setView(marker._latlng, 2);
    })



    $scope.createLocation = function () {
        if (validate()) {
            $locationService.create($scope.newLocation).then(function onSuccess(response) {
                $scope.redirect(`/locations/${response.data.location_id}`);
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

    var validate = function () {

        isValid = true;
        if ($scope.newLocation.name == "") {
            name_input.parent().parent().addClass('has-danger')
            name_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newLocation.description == "") {
            desc_input.parent().parent().addClass('has-danger')
            desc_input.addClass('form-control-danger');
            isValid = false;
        }

        if ($scope.newLocation.lat == 0 && $scope.newLocation.lng == 0) {
            isValid = false;
            lat_input.parent().parent().addClass('has-danger')
            lat_input.addClass('form-control-danger');
            lng_input.parent().parent().addClass('has-danger')
            lng_input.addClass('form-control-danger');
        }
        return isValid;
    }

})