var app = angular.module("ive");


// Preview map request filter
app.filter('previewMapRequest', function(config) {
    return function(data, relationship_label, start) {
        var color = "FF3300";
        var zoom = 17;
        var width = 500;
        var height = 300;
        var retina = "@2x";

        var lat;
        var lng;
        var location_type;

        if(!data){
            return null;
        } else {
            switch (relationship_label) {
                case 'belongs_to': {
                    lat = data.location_lat;
                    lng = data.location_lng;
                    location_type = data.location_type;
                    break;
                }
                case 'connected_to': {
                    if(start){
                        lat = data.start_location_lat;
                        lng = data.start_location_lng;
                        location_type = data.start_location_type;
                    } else {
                        lat = data.end_location_lat;
                        lng = data.end_location_lng;
                        location_type = data.end_location_type;
                    }
                    break;
                }
                case 'has_parent_location': {
                    if(start){
                        lat = data.child_location_lat;
                        lng = data.child_location_lng;
                        location_type = data.child_location_type;
                    } else {
                        lat = data.parent_location_lat;
                        lng = data.parent_location_lng;
                        location_type = data.parent_location_type;
                    }
                    break;
                }
                case 'recorded_at': {
                    lat = data.location_lat;
                    lng = data.location_lng;
                    location_type = data.location_type;
                    break;
                }
                default: {
                    lat = data.lat;
                    lng = data.lng;
                    location_type = data.location_type;
                }
            }

            switch (location_type) {
                case 'outdoor':
                    color = "007FFF";
                    break;
                case 'indoor':
                    color = "636C72";
                    break;
                case 'abstract':
                    color = "32CD32";
                    break;
                default: {

                }
            }

            var url =
                config.mapboxStaticAPI +
                "pin-m+" + color + "(" + lng + "," + lat + ")/" +
                lng + "," + lat + "," + zoom + "/" +
                width + "x" + height + retina + "?access_token=" + config.mapboxAccessToken;

            return url;
        }
    };
});
