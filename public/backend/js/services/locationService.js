var app = angular.module("locationService", []);

/**
 * Location Service Provider
 */
app.factory('$locationService', function($http, config) {

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
            return $http.post(config.apiURL + "/locations", data);
        },
        edit: function(location_id, data) {
            return $http.put(config.apiURL + "/locations/" + location_id, data);
        },
        remove: function(location_id) {
            return $http.delete(config.apiURL + "/locations/" + location_id);
        }

    };

});
