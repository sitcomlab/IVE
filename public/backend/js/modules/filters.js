var app = angular.module("filters", ['angular-momentjs']);

/**
 * timestamp filter
 */
app.filter('timestamp', function() {
    return function(timestamp) {
        if(timestamp){
            return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return "-";
        }
    };
});

/**
 * uppercase filter
 */
app.filter('uppercase', function() {
    return function(relationship) {
        return relationship.toUpperCase();
    };
});
