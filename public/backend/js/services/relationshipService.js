var app = angular.module("relationshipService", []);

/**
 * Relationship Service Provider
 */
app.factory('$relationshipService', function($http, config) {

    return {
        init: function(label){
            var new_object;
            switch (label) {
                case 'belongs_to': {
                    new_object = {
                        scenario_id: null
                    };
                    break;
                }
                case 'connected_to': {
                    new_object = {
                        start_location_id: null,
                        end_location_id: null,
                        weight: 1
                    };
                    break;
                }
                case 'embedded_in': {
                    new_object = {
                        overlay_id: null,
                        video_id: null,
                        w: 300,
                        h: 200,
                        d: 0,
                        x: 1,
                        y: 1,
                        z: 0,
                        rx: 0,
                        ry: 0,
                        rz: 0,
                        display: true
                    };
                    break;
                }
                case 'parent_location': {
                    new_object = {
                        start_location_id: null,
                        end_location_id: null,
                    };
                    break;
                }
                case 'recorded_at': {
                    new_object = {
                        video_id: null,
                        location_id: null,
                        preferred: true,
                    };
                    break;
                }
            }
            return new_object;
        },
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
        retrieve_by_id: function(relationship_type, relationship_id) {
            return $http.get(config.apiURL + "/relationship/" + relationship_type + "/" + relationship_id);
        },
        create: function(data) {
            return $http.post(config.apiURL + "/relationships", data);
        },
        edit: function(relationship_type, relationship_id, data) {
            return $http.put(config.apiURL + "/relationship/" + relationship_type + "/" + relationship_id, data);
        },
        remove: function(relationship_id) {
            return $http.delete(config.apiURL + "/relationships/" + relationship_id);
        }
    };

});
