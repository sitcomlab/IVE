var app = angular.module("locationService", []);

/**
 * Location Service Provider
 */
app.factory('$locationService', function($http, config) {

    return {

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
        create: function() {
            return $http.post(config.apiURL + "/locations/" + location_id);
        },
        edit: function(location_id) {
            return $http.put(config.apiURL + "/locations/" + location_id);
        },
        delete: function(location_id) {
            return $http.delete(config.apiURL + "/locations/" + location_id);
        }

    };

});
