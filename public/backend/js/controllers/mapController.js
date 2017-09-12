var app = angular.module("ive");

// Map controller
app.controller("mapController", function($scope, $rootScope, $filter, $translate, $location, config, $window, $locationService, $relationshipService) {
    $scope.$parent.loading = { status: false, message: "" };

    /**
     * Load data
     * @return {[type]} [description]
     */
    $scope.load = function(data){
        switch (data) {
            case 'locations': {
                $locationService.list()
                .then(function onSuccess(response) {
                    $scope.locations = response.data;
                    $scope.location_geojson = $filter('toGeoJSON')(response.data);

                    // Update sources
                    map.getSource('markers').setData($scope.location_geojson);
                })
                .catch(function onError(response) {
                    $window.alert(response.data);
                });

                break;
            }
            case 'connected_to': {
                break;
            }
            case 'has_parent_location': {
                break;
            }
            default: {

            }
        }
    };


    $scope.mapStyle = 'streets-v9';
    mapboxgl.accessToken = config.mapboxAccessToken;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/' + $scope.mapStyle,
        center: [7.634355, 51.956875],
        zoom: 14
    });


    /**
     * [position description]
     * @type {String}
     */
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');


    /**
     * [features description]
     * @type {[type]}
     */
    map.on('load', function() {

        // Load data
        $scope.load("locations");


        // Add geojson data as a new source
        map.addSource("markers", {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        });


        // Add source as a layer and apply some styles
        map.addLayer({
            "id": "locations",
            "type": "circle",
            "source": "markers",
            "paint": {
                'circle-color': {
                    property: 'location_type',
                    type: 'categorical',
                    stops: [
                        ['abstract', '#00ff00'],
                        ['outdoor', '#0000ff'],
                        ['indoor', '#ff0000'],
                    ]
                },
                'circle-radius': {
                    property: 'location_type',
                    type: 'categorical',
                    stops: [
                        ['abstract', 5],
                        ['outdoor', 5],
                        ['indoor', 5]
                    ]
                },
            },
            "layout": {
                "visibility": "visible"
            }
        });

        // Load data
        var bounds = map.getBounds();
        var bbox = {
            xmin: bounds.getSouthWest().lng,
            ymin: bounds.getSouthWest().lat,
            xmax: bounds.getNorthEast().lng,
            ymax: bounds.getNorthEast().lat
        };

        // When a click event occurs near a place, open a popup at the location of
        // the feature, with description HTML from its properties.
        map.on('click', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: [
                    'locations'
                ]
            });

            if (!features.length) {
                return;
            }

            var feature = features[0];
            var popup = new mapboxgl.Popup({
                closeButton: false
            });

            console.log(feature.properties);

            var content = "";

            if(feature.layer.id === 'locations'){
                content = '' +
                '<b>' +
                    '<a href="locations/' + feature.properties.location_id + '">' + feature.properties.location_name + '</a>' +
                '</b>';
            }

            popup.setLngLat(feature.geometry.coordinates)
            .setHTML(content)
            .addTo(map);

        });

        // Use the same approach as above to indicate that the symbols are clickable
        // by changing the cursor style to 'pointer'.
        map.on('mousemove', function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: [
                    'locations'
                ]
            });
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });


        /**
         * [description]
         * @return {[type]} [description]
         */
        map.on('zoom', function() {
            var zoom = map.getZoom();
        });

        /**
         * [bounds description]
         * @type {[type]}
         */
        map.on('dragend', function(){
            var bounds = map.getBounds();
            var bbox = {
                xmin: bounds.getSouthWest().lng,
                ymin: bounds.getSouthWest().lat,
                xmax: bounds.getNorthEast().lng,
                ymax: bounds.getNorthEast().lat
            };
        });

        /**
         * [bounds description]
         * @type {[type]}
         */
        map.on('rotateend', function(){
            var bounds = map.getBounds();
            var bbox = {
                xmin: bounds.getSouthWest().lng,
                ymin: bounds.getSouthWest().lat,
                xmax: bounds.getNorthEast().lng,
                ymax: bounds.getNorthEast().lat
            };
        });

        /**
         * [bounds description]
         * @type {[type]}
         */
        map.on('zoomend', function(){
            var bounds = map.getBounds();
            var bbox = {
                xmin: bounds.getSouthWest().lng,
                ymin: bounds.getSouthWest().lat,
                xmax: bounds.getNorthEast().lng,
                ymax: bounds.getNorthEast().lat
            };
        });
    });

});
