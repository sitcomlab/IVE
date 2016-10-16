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
        }

    };

});
