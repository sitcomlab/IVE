var app = angular.module("locationService", []);

/**
 * Location Service Provider
 */
app.factory('$locationService', function($http, config, $authenticationService) {

    return {
        init: function() {
            return {
                name: "",
                description: "",
                location_type: "outdoor",
                lng: null,
                lat: null
            };
        },
        list: function() {
            return $http.get(config.apiURL + "/locations");
        },
        list_by_scenario: function(scenario_id) {
            return $http.get(config.apiURL + "/scenarios/" + scenario_id + "/locations");
        },
        list_by_location: function(location_id) {
            return $http.get(config.apiURL + "/locations/" + location_id + "/locations");
        },
        retrieve: function(location_id) {
            return $http.get(config.apiURL + "/locations/" + location_id);
        },
        create: function(data) {
            return $http.post(config.apiURL + "/locations", data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        edit: function(location_id, data) {
            return $http.put(config.apiURL + "/locations/" + location_id, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        remove: function(location_id) {
            return $http.delete(config.apiURL + "/locations/" + location_id, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });
        }
    };

});
