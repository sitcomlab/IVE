var app = angular.module("locationService", []);

/**
 * Location Service Provider
 */
app.factory('$locationService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.getApiEndpoint() + "/locations");
        },
        list_by_scenario: function(scenario_id) {
            return $http.get(config.getApiEndpoint() + "/scenarios/" + scenario_id + "/locations");
        },
        list_by_location: function(location_id) {
            return $http.get(config.getApiEndpoint() + "/locations/" + location_id + "/locations");
        },
        retrieve: function(location_id) {
            return $http.get(config.getApiEndpoint() + "/locations/" + location_id);
        }

    };

});
