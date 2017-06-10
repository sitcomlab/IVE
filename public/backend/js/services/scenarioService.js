var app = angular.module("scenarioService", []);

/**
 * Scenario Service Provider
 */
app.factory('$scenarioService', function($http, config, $authenticationService) {

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
                description: ""
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

            return $http.get(config.getApiEndpoint() + "/scenarios" + query);
        },
        search_by_scenario: function(pagination, filter) {
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

            return $http.post(config.getApiEndpoint() + "/search/scenarios" + query, {
                search_text: filter.search_text
            });
        },
        retrieve: function(scenario_id) {
            return $http.get(config.getApiEndpoint() + "/scenarios/" + scenario_id);
        },
        create: function(data) {
            return $http.post(config.getApiEndpoint() + "/scenarios", data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        edit: function(scenario_id, data) {
            return $http.put(config.getApiEndpoint() + "/scenarios/" + scenario_id, data, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken(),
                    'Content-Type': 'application/json'
                }
            });
        },
        remove: function(scenario_id) {
            return $http.delete(config.getApiEndpoint() + "/scenarios/" + scenario_id, {
                headers: {
                    'Authorization': 'Bearer ' + $authenticationService.getToken()
                }
            });
        }

    };

});
