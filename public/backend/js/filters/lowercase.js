var app = angular.module("ive");


// Lowercase filter
app.filter('lowercase', function() {
    return function(text) {
        return text.toLowerCase();
    };
});
