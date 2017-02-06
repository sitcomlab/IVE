var app = angular.module("relationshipService", []);

/**
 * Relationship Service Provider
 */
app.factory('$relationshipService', function($http, config, $authenticationService) {

    return {
        init: function(relationship_type, label){
            var new_object;
            switch (relationship_type){
                case 'belongs_to': {
                    new_object = {
                        scenario_id: null
                    };
                    switch (label){
                        case 'location': {
                            new_object.location_id = null;
                            break;
                        }
                        case 'video': {
                            new_object.video_id = null;
                            break;
                        }
                        case 'overlay': {
                            new_object.overlay_id = null;
                            break;
                        }
                    }
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
                        end_location_id: null
                    };
                    break;
                }
                case 'recorded_at': {
                    new_object = {
                        video_id: null,
                        location_id: null,
                        preferred: true
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
        retrieve_by_id: function(relationship_type, relationship_id, label) {
            if(label){
                return $http.get(config.apiURL + "/relationship/" + relationship_type + "/" + relationship_id + "/" + label);
            } else {
                return $http.get(config.apiURL + "/relationship/" + relationship_type + "/" + relationship_id);
            }
        },
        create: function(relationship_type, label, data) {
            return $http.post(config.apiURL + "/relationship/" + relationship_type + "/" + label, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        edit: function(relationship_type, relationship_id, label, data) {
            return $http.put(config.apiURL + "/relationship/" + relationship_type + "/" + relationship_id + "/" + label, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        remove: function(relationship_id) {
            return $http.delete(config.apiURL + "/relationships/" + relationship_id, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });
        }
    };

});
