var app = angular.module("videoService", []);

/**
 * Video Service Provider
 */
app.factory('$videoService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.getApiEndpoint() + "/videos");
        },
        list_by_scenario: function(scenario_id) {
            return $http.get(config.getApiEndpoint() + "/scenarios/" + scenario_id + "/videos");
        },
        list_by_location: function(location_id) {
            return $http.get(config.getApiEndpoint() + "/locations/" + location_id + "/videos");
        },
        get: function(video_id) {
            return $http.get(config.getApiEndpoint() + "/videos/" + video_id);
        }

    };

});
