var app = angular.module("locationService", []);

/**
 * Location Service Provider
 */
app.factory('$locationService', function($http, config, $authenticationService) {

    // Query cache
    var cache = {
        full_count: 0,
        pagination: {
            skip: 0,
            limit: 50
        },
        filter: {
            search_text: ""
        }
    };

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
        getCount: function(){
            return cache.full_count;
        },
        getFilter: function(){
            return cache.filter;
        },
        getPagination: function(){
            return cache.pagination;
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
                if(pagination.skip && pagination.skip !== null){
                    query = query + "skip=" + pagination.skip + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.filterName && filter.filterName !== null){
                    query = query + "filterName=" + filter.filterName + "&";
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
                if(pagination.skip && pagination.skip !== null){
                    query = query + "skip=" + pagination.skip + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.filterName && filter.filterName !== null){
                    query = query + "filterName=" + filter.filterName + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.post(config.getApiEndpoint() + "/search/locations" + query, {
                search_text: filter.search_text
            });
        },
        list_by_scenario: function(scenario_id, pagination, filter) {
            // Initalize query
            var query = "?";

            // Add pagination to query
            if(pagination){
                if(pagination.skip && pagination.skip !== null){
                    query = query + "skip=" + pagination.skip + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.filterName && filter.filterName !== null){
                    query = query + "filterName=" + filter.filterName + "&";
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
                if(pagination.skip && pagination.skip !== null){
                    query = query + "skip=" + pagination.skip + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.filterName && filter.filterName !== null){
                    query = query + "filterName=" + filter.filterName + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.post(config.getApiEndpoint() + "/search/scenarios/" + scenario_id + "/locations" + query, {
                search_text: filter.search_text
            });
        },
        list_by_location: function(location_id, pagination, filter) {
            // Initalize query
            var query = "?";

            // Add pagination to query
            if(pagination){
                if(pagination.skip && pagination.skip !== null){
                    query = query + "skip=" + pagination.skip + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.filterName && filter.filterName !== null){
                    query = query + "filterName=" + filter.filterName + "&";
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
                if(pagination.skip && pagination.skip !== null){
                    query = query + "skip=" + pagination.skip + "&";
                }
                if(pagination.limit && pagination.limit !== null){
                    query = query + "limit=" + pagination.limit + "&";
                }
            }

            // Add filters to query
            if(filter){
                if(filter.filterName && filter.filterName !== null){
                    query = query + "filterName=" + filter.filterName + "&";
                }
            }

            // Finalize query
            query = query.slice(0, -1);

            return $http.post(config.getApiEndpoint() + "/search/locations/" + location_id + "/locations" + query, {
                search_text: filter.search_text
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
