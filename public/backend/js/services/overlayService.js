var app = angular.module("overlayService", []);

/**
 * Overlay Service Provider
 */
app.factory('$overlayService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.apiURL + "/overlays");
        },
        list_by_scenario: function(scenario_id) {
            return $http.get(config.apiURL + "/scenarios/" + scenario_id + "/overlays");
        },
        list_by_video: function(video_id) {
            return $http.get(config.apiURL + "/videos/" + video_id + "/overlays");
        },
        retrieve: function(overlay_id) {
            return $http.get(config.apiURL + "/overlays/" + overlay_id);
        },
        create: function() {
            return $http.post(config.apiURL + "/overlays");
        },
        edit: function(overlay_id) {
            return $http.put(config.apiURL + "/overlays/" + overlay_id);
        },
        delete: function(overlay_id) {
            return $http.delete(config.apiURL + "/overlays/" + overlay_id);
        }

    };

});
