var app = angular.module("ive");


// Uppercase filter
app.filter('uppercase', function() {
    return function(text) {
        return text.toUpperCase();
    };
});
