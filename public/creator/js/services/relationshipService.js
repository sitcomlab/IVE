var app = angular.module("relationshipService", []);

/**
 * Relationship Service Provider
 */
app.factory('$relationshipService', function($http, config, $authenticationService) {

    // Query cache
    var cache = {
        full_count: 0,
        pagination: {
            offset: 0,
            limit: config.limit
        },
        filter: {
            orderby: "name.asc",
            relationship_type: null,
            search_term: ""
        }
    };

    return {
        init: function(relationship_label, relationship_type){
            var new_object;
            switch (relationship_label){
                case 'belongs_to': {
                    new_object = {
                        scenario_id: null
                    };
                    switch (relationship_type){
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
                        end_location_id: null
                    };
                    break;
                }
                case 'embedded_in': {
                    new_object = {
                        overlay_id: null,
                        video_id: null,
                        w: 3,
                        h: 2,
                        d: 0,
                        x: 0,
                        y: 0,
                        z: 0,
                        rx: 0,
                        ry: 0,
                        rz: 0,
                        display: true
                    };
                    break;
                }
                case 'has_parent_location': {
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
        get_labels: function() {
            return [
                {
                    name: "belongs_to"
                }, {
                    name: "connected_to"
                }, {
                    name: "embedded_in"
                }, {
                    name: "has_parent_location"
                }, {
                    name: "recorded_at"
                }
            ];
        },
        getCount: function(){
            return cache.full_count;
        },
        getFilter: function(){
            return cache.filter;
        },
        getPagination: function(){
            return cache.pagination;
        },
        resetCache: function() {
            cache = {
                full_count: 0,
                pagination: {
                    offset: 0,
                    limit: config.limit
                },
                filter: {
                    orderby: "name.asc",
                    relationship_type: null,
                    search_term: ""
                }
            };
        },
        setCount: function(data) {
            cache.full_count = data;
        },
        setFilter: function(data) {
            cache.filter = data;
        },
        setPagination: function(data) {
            cache.pagination = data;
        },
        /*list: function() {
            return $http.get(config.getApiEndpoint() + "/relationships");
        },*/
        list_by_label: function(relationship_label, pagination, filter) {
            // Initalize query
            var query = "?";

            // Add pagination to query
            if(pagination){
                if(pagination.offset && pagination.offset !== null){
                    query = query + "skip=" + pagination.offset + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.orderby && filter.orderby !== null){
                    query = query + "orderby=" + filter.orderby + "&";
                }
                if(filter.relationship_type && filter.relationship_type !== null){
                    query = query + "relationship_type=" + filter.relationship_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.get(config.getApiEndpoint() + "/relationship/" + relationship_label + query);
        },
        search_by_label: function(relationship_label, pagination, filter) {
            // Initalize query
            var query = "?";

            // Add pagination to query
            if(pagination){
                if(pagination.offset && pagination.offset !== null){
                    query = query + "skip=" + pagination.offset + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.orderby && filter.orderby !== null){
                    query = query + "orderby=" + filter.orderby + "&";
                }
                if(filter.relationship_type && filter.relationship_type !== null){
                    query = query + "relationship_type=" + filter.relationship_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.post(config.getApiEndpoint() + "/search/relationship/" + relationship_label + query, {
                search_term: filter.search_term
            });
        },
        retrieve_by_id: function(relationship_label, relationship_id, relationship_type) {
            if(relationship_type){
                return $http.get(config.getApiEndpoint() + "/relationship/" + relationship_label + "/" + relationship_id + "/" + relationship_type);
            } else {
                return $http.get(config.getApiEndpoint() + "/relationship/" + relationship_label + "/" + relationship_id);
            }
        },
        create: function(relationship_label, data, relationship_type) {
            data.body = { refresh: $authenticationService.getRefreshToken() };
            if(relationship_type){
                return $http.post(config.getApiEndpoint() + "/relationship/" + relationship_label + "/" + relationship_type, data, {
                    headers: {
                        'Authorization': 'Bearer ' + $authenticationService.getToken(),
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                return $http.post(config.getApiEndpoint() + "/relationship/" + relationship_label, data, {
                    headers: {
                        'Authorization': 'Bearer ' + $authenticationService.getToken(),
                        'Content-Type': 'application/json'
                    }
                });
            }
        },
        edit: function(relationship_label, relationship_id, data) {
            data.body = { refresh: $authenticationService.getRefreshToken() };
            return $http.put(config.getApiEndpoint() + "/relationship/" + relationship_label + "/" + relationship_id, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        remove: function(relationship_id) {
            return $http.delete(config.getApiEndpoint() + "/relationships/" + relationship_id, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                },
                body: {
                    refresh: $authenticationService.getRefreshToken()
                }
            });
        }
    };

});
