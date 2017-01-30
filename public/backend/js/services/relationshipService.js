var app = angular.module("relationshipService", []);

/**
 * Relationship Service Provider
 */
app.factory('$relationshipService', function($http, config) {

    return {
        get_types: function() {
            return [
                {
                    name: "belongs_to"
                }, {
                    name: "connected_to"
                }, {
                    name: "embedded_in"
                }, {
                    name: "parent_location"
                }, {
                    name: "recorded_at"
                }
            ];
        },
        list: function() {
            return $http.get(config.apiURL + "/relationships");
        },
        list_by_type: function(relationship_type, label) {
            if(label){
                return $http.get(config.apiURL + "/relationship/" + relationship_type + "/" + label);
            } else {
                return $http.get(config.apiURL + "/relationship/" + relationship_type);
            }
        },
        get: function(relationship_id) {
            return $http.get(config.apiURL + "/relationships/" + relationship_id);
        }
    };

});
