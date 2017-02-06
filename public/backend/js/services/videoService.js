var app = angular.module("videoService", []);

/**
 * Video Service Provider
 */
app.factory('$videoService', function($http, config, $authenticationService) {

    return {
        init: function() {
            return {
                name: "",
                description: "",
                url: "",
                recorded: ""
            };
        },
        list: function() {
            return $http.get(config.apiURL + "/videos");
        },
        list_by_scenario: function(scenario_id) {
            return $http.get(config.apiURL + "/scenarios/" + scenario_id + "/videos");
        },
        list_by_location: function(location_id) {
            return $http.get(config.apiURL + "/locations/" + location_id + "/videos");
        },
        retrieve: function(video_id) {
            return $http.get(config.apiURL + "/videos/" + video_id);
        },
        create: function(data) {
            return $http.post(config.apiURL + "/videos", data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        edit: function(video_id, data) {
            return $http.put(config.apiURL + "/videos/" + video_id, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        remove: function(video_id) {
            return $http.delete(config.apiURL + "/videos/" + video_id, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });
        }

    };

});
