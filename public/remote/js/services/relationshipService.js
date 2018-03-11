var app = angular.module("relationshipService", []);

/**
 * Relationship Service Provider
 */
app.factory('$relationshipService', function($http, config) {

    return {
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
        }
    };

});
