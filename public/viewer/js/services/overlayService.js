var app = angular.module("overlayService", []);

/**
 * Overlay Service Provider
 */
app.factory('$overlayService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.getApiEndpoint() + "/overlays");
        },
        list_by_scenario: function(scenario_id) {
            return $http.get(config.getApiEndpoint() + "/scenarios/" + scenario_id + "/overlays");
        },
        list_by_video: function(video_id) {
            return $http.get(config.getApiEndpoint() + "/videos/" + video_id + "/overlays");
        },
        get: function(overlay_id) {
            return $http.get(config.getApiEndpoint() + "/overlays/" + overlay_id);
        }

    };

});
