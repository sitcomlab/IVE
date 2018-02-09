var app = angular.module("routes", []);

// Add custom directive for <head> element to attach css to the specified routes
app.directive('head', ['$rootScope', '$compile',
    function ($rootScope, $compile) {
        return {
            restrict: 'E',
            link: function (scope, elem) {
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if (current && current.$$route && current.$$route.css) {
                        if (!angular.isArray(current.$$route.css)) {
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function (sheet) {
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if (next && next.$$route && next.$$route.css) {
                        if (!angular.isArray(next.$$route.css)) {
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function (sheet) {
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);

/**
 * Routing for the CMS
 */

app.config(function ($routeProvider, $locationProvider, config) {

    $routeProvider
        .when("/", {
            templateUrl: "js/templates/home.html",
            controller: "homeController",
            css: "css/templates/home.css"
        })
        .when("/scenarios", {
            templateUrl: "js/templates/scenarios/overview.html",
            controller: "scenarioOverviewController",
            css: "css/templates/scenarios/overview.css"
        })
        .when("/scenarios/create-new", {
            templateUrl: "js/templates/scenarios/create-new.html",
            controller: "scenarioCreateNewController",
            css: "css/templates/scenarios/create-new.css"
        })
        .when("/scenarios/:scenario_id", {
            templateUrl: "js/templates/scenarios/detail.html",
            controller: "scenarioDetailController",
            css: "css/templates/scenarios/detail.css"
        })
        .when("/videos", {
            templateUrl: "js/templates/videos/overview.html",
            controller: "videoOverviewController",
            css: "css/templates/videos/overview.css"
        })
        .when("/videos/create-new", {
            templateUrl: "js/templates/videos/create-new.html",
            controller: "videoCreateNewController",
            css: "css/templates/videos/create-new.css"
        })
        .when("/videos/:video_id", {
            templateUrl: "js/templates/videos/detail.html",
            controller: "videoDetailController",
            css: "css/templates/videos/detail.css"
        })
        .when("/overlays", {
            templateUrl: "js/templates/overlays/overview.html",
            controller: "overlayOverviewController",
            css: "css/templates/overlays/overview.css"
        })
        .when("/overlays/create-new", {
            templateUrl: "js/templates/overlays/create-new.html",
            controller: "overlayCreateNewController",
            css: "css/templates/overlays/create-new.css"
        })
        .when("/overlays/:overlay_id", {
            templateUrl: "js/templates/overlays/detail.html",
            controller: "overlayDetailController",
            css: "css/templates/overlays/detail.css"
        })
        .when("/locations", {
            templateUrl: "js/templates/locations/overview.html",
            controller: "locationOverviewController",
            css: "css/templates/locations/overview.css"
        })
        .when("/locations/create-new", {
            templateUrl: "js/templates/locations/create-new.html",
            controller: "locationCreateNewController",
            css: "css/templates/locations/create-new.css"
        })
        .when("/locations/:location_id", {
            templateUrl: "js/templates/locations/detail.html",
            controller: "locationDetailController",
            css: "css/templates/locations/detail.css"
        })
        .when("/about", {
            templateUrl: "js/templates/about.html",
            controller: "aboutController",
            css: "css/templates/about.css"
        })

        // Redirect to home page
        .otherwise({
            redirectTo: "/"
        });

    $locationProvider.html5Mode(config.html5Mode);
})


/**
 * [checkAuthentication description]
 * @param  {[type]} $q                     [description]
 * @param  {[type]} $location              [description]
 * @param  {[type]} $authenticationService [description]
 * @return {[type]}                        [description]
 */
var checkAuthentication = function ($q, $location, $authenticationService) {
    if ($authenticationService.authenticated()) {
        return true;
    } else {
        // Redirect
        $location.url("/");
    }
};