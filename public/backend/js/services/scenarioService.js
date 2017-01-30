var app = angular.module("scenarioService", []);

/**
 * Scenario Service Provider
 */
app.factory('$scenarioService', function($http, config) {

    return {
        init: function() {
            return {
                name: "",
                description: ""
            };
        },
        list: function() {
            return $http.get(config.apiURL + "/scenarios");
        },
        retrieve: function(scenario_id) {
            return $http.get(config.apiURL + "/scenarios/" + scenario_id);
        },
        create: function(data) {
            return $http.post(config.apiURL + "/scenarios", data);
        },
        edit: function(scenario_id, data) {
            return $http.put(config.apiURL + "/scenarios/" + scenario_id, data);
        },
        remove: function(scenario_id) {
            return $http.delete(config.apiURL + "/scenarios/" + scenario_id);
        }

    };

});
