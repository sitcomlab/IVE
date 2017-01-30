var app = angular.module("filters", []);

/**
 * time filter
 */
app.filter('timeFilter', function() {
    return function(time) {
        return time.substr(0, 5);
    };
});

/**
 * uppercase filter
 */
app.filter('uppercaseFilter', function() {
    return function(relationship) {
        return relationship.toUpperCase();
    };
});
