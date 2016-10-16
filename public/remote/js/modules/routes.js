var app = angular.module("routes", []);

/**
 * Route Provider
 */
app.config(function($routeProvider) {
    $routeProvider

        // Home
        .when("/", {
            templateUrl: "js/templates/main.html",
            controller: "mainController"
        })

        // Redirect
        .otherwise({
            redirectTo: "/"
        });
});
