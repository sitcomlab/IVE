var app = angular.module("overlayService", []);

/**
 * Overlay Service Provider
 */
app.factory('$overlayService', function($http, config, $authenticationService) {

    return {
        init: function() {
            return {
                name: "",
                description: "",
                category: "website",
                url: ""
            };
        },
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
        create: function(data) {
            return $http.post(config.apiURL + "/overlays", data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        edit: function(overlay_id, data) {
            return $http.put(config.apiURL + "/overlays/" + overlay_id, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        remove: function(overlay_id) {
            return $http.delete(config.apiURL + "/overlays/" + overlay_id, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });
        }

    };

});
