var app = angular.module("ive");


// to GeoJSON filter
app.filter('toGeoJSON', function() {
    return function(locations) {
        var geojson = {
            type: "FeatureCollection",
            features: []
        };

        for(var i=0; i<locations.length; i++){
            geojson.features.push({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        locations[i].lng,
                        locations[i].lat
                    ]
                },
                properties: {
                    location_id: locations[i].location_id,
                    location_uuid: locations[i].location_uuid,
                    location_name: locations[i].name,
                    location_description: locations[i].description,
                    location_type: locations[i].location_type,
                    location_lng: locations[i].lng,
                    location_lat: locations[i].lat
                }
            });
        }

        return geojson;
    };
});
