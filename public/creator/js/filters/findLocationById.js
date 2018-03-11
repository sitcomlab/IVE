var app = angular.module("ive");


// Find location by ID filter
app.filter('findLocationById', function(config, _) {
    return function(location_id, locations) {
        if(location_id && location_id !== null){
            var location = _.findWhere(locations, { location_id: location_id });
            return location;
        } else {
            return null;
        }
    };
});
