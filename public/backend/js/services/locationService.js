var app = angular.module("locationService", []);

/**
 * Location Service Provider
 */
app.factory('$locationService', function($http, config, $authenticationService) {

    // Query cache
    var cache = {
        full_count: 0,
        pagination: {
            offset: 0,
            limit: config.limit
        },
        filter: {
            orderby: "name.asc",
            location_type: null,
            search_term: ""
        }
    };

    return {
        init: function() {
            return {
                name: "",
                description: null,
                location_type: "outdoor",
                lng: null,
                lat: null
            };
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
                    location_type: null,
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
        list: function(pagination, filter) {
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
                if(filter.location_type && filter.location_type !== null){
                    query = query + "location_type=" + filter.location_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.get(config.getApiEndpoint() + "/locations" + query);
        },
        search: function(pagination, filter) {
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
                if(filter.location_type && filter.location_type !== null){
                    query = query + "location_type=" + filter.location_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.post(config.getApiEndpoint() + "/search/locations" + query, {
                search_term: filter.search_term
            });
        },
        list_by_scenario: function(scenario_id, pagination, filter) {
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
                if(filter.location_type && filter.location_type !== null){
                    query = query + "location_type=" + filter.location_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.get(config.getApiEndpoint() + "/scenarios/" + scenario_id + "/locations" + query);
        },
        search_by_scenario: function(scenario_id, pagination, filter) {
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
                if(filter.location_type && filter.location_type !== null){
                    query = query + "location_type=" + filter.location_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.post(config.getApiEndpoint() + "/search/scenarios/" + scenario_id + "/locations" + query, {
                search_term: filter.search_term
            });
        },
        list_by_location: function(location_id, pagination, filter) {
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
                if(filter.location_type && filter.location_type !== null){
                    query = query + "location_type=" + filter.location_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.get(config.getApiEndpoint() + "/locations/" + location_id + "/locations" + query);
        },
        search_by_location: function(location_id, pagination, filter) {
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
                if(filter.location_type && filter.location_type !== null){
                    query = query + "location_type=" + filter.location_type + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.post(config.getApiEndpoint() + "/search/locations/" + location_id + "/locations" + query, {
                search_term: filter.search_term
            });
        },
        retrieve: function(location_id) {
            return $http.get(config.getApiEndpoint() + "/locations/" + location_id);
        },
        create: function(data) {
            return $http.post(config.getApiEndpoint() + "/locations", data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        edit: function(location_id, data) {
            return $http.put(config.getApiEndpoint() + "/locations/" + location_id, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        remove: function(location_id) {
            return $http.delete(config.getApiEndpoint() + "/locations/" + location_id, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });
        }
    };

});
