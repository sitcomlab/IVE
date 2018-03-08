var app = angular.module("ive");

// Location create controller
app.controller("locationCreateController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $locationService) {

    /*************************************************
        FUNCTIONS
     *************************************************/

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function(path){
        $location.url(path);
    };

    /**
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.createLocationForm.$invalid) {
            // Update UI
            $scope.createLocationForm.name.$pristine = false;
            $scope.createLocationForm.description.$pristine = false;
            $scope.createLocationForm.location_type.$pristine = false;
            $scope.createLocationForm.lng.$pristine = false;
            $scope.createLocationForm.lat.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_LOCATION') };

            $locationService.create($scope.location)
            .then(function onSuccess(response) {
                var new_location = response.data;
                $scope.redirect("/locations/" + new_location.location_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };

    $scope.changeCoordinates = function (){
        console.log($scope.long);
        $scope.location.lng = $scope.long;
        $scope.location.lat = $scope.lati;
        console.log($scope.location);
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.location = $locationService.init();
    $scope.$parent.loading = { status: false, message: "" };

    $scope.mapStyle = 'streets-v9';
    mapboxgl.accessToken = config.mapboxAccessToken;
    $scope.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/' + $scope.mapStyle,
        center: [7.634355, 51.956875],
        zoom: 14
    });


    /**
     * [position description]
     * @type {String}
     */
    $scope.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Add geolocate control to the map.
    $scope.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    $scope.map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    }));

    $scope.map.on('click', function (e){
        $scope.long = e.lngLat.lng;
        $scope.lati = e.lngLat.lat;
        $scope.changeCoordinates();
    });

});
