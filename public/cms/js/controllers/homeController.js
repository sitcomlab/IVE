var app = angular.module("ive_cms");

app.controller("homeController", function ($scope, $rootScope, $relationshipService, leafletData, $location, $window) {


    var scenario_markers = [];
    var video_markers = [];

    $scope.active = '';

    $rootScope.currentCategory = null;
    $rootScope.currentSite = null;

    var featureGroup;


    $relationshipService.list_by_type("belongs_to", "location")
        .then(function onSuccess(response) {
            // Iterate over the locations and create markers --> add type (video / scenarios) to obj
            var scenarioID = "";
            response.data.forEach(function (element) {
                // Indoor locations won't be added but it's abstract parent will
                if (element.location_type != "indoor") {

                    // Expect that we have a scenario here we want to display
                    if (scenarioID == element.s_id) {
                        return;
                    }

                    scenarioID = element.s_id;

                    var myIcon = new L.Icon({
                        iconUrl: 'images/scenariomarker.png',
                        iconRetinaUrl: 'images/scenariomarker@2x.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41]
                    })
                    var markerObject = L.marker(L.latLng(element.location_lat, element.location_lng), {
                        title: element.scenario_name,
                        clickable: true,
                        icon: myIcon
                    })

                    markerObject.on('click', function () {
                        $scope.redirect('/scenarios/' + element.scenario_id);
                    })

                    if (element.location_type == "abstract") {
                        markerObject.options.title = element.location_name + " ABSTRACT";
                    }

                    scenario_markers.push(markerObject)

                }
            }, this);

            // Prepared for map manipulation...
            leafletData.getMap('map').then(function (map) {

                featureGroup = L.featureGroup(scenario_markers).addTo(map);
                map.fitBounds(featureGroup.getBounds(), {
                    animate: false,
                    padding: L.point(50, 50)
                })

            })

        })
        .catch(function onError(response) {
            $window.alert(response.data);
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

});