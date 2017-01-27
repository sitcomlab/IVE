var app = angular.module("routes", []);

/**
 * Route Provider
 */
app.config(function($routeProvider, $locationProvider, config) {
    $routeProvider

        // Home (Login)
        .when("/", {
            templateUrl: "js/templates/login.html",
            controller: "loginController"
        })
        .when("/help", {
            templateUrl: "js/templates/help.html",
            controller: "helpController"
        })

        // Scenarios
        .when("/scenarios", {
            templateUrl: "js/templates/scenario/list.html",
            controller: "scenarioListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/scenarios/:scenario_id", {
            templateUrl: "js/templates/scenario/details.html",
            controller: "scenarioDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        /*.when("/scenarios/:scenario_id/edit", {
            templateUrl: "js/templates/scenario/edit.html",
            controller: "scenarioEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/scenario", {
            templateUrl: "js/templates/scenario/create.html",
            controller: "scenarioCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })*/

        // Locations
        .when("/locations", {
            templateUrl: "js/templates/location/list.html",
            controller: "locationListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/locations/:location_id", {
            templateUrl: "js/templates/location/details.html",
            controller: "locationDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        /*.when("/locations/:location_id/edit", {
            templateUrl: "js/templates/location/edit.html",
            controller: "locationEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/location", {
            templateUrl: "js/templates/location/create.html",
            controller: "locationCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })*/

        // Videos
        .when("/videos", {
            templateUrl: "js/templates/video/list.html",
            controller: "videoListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/videos/:video_id", {
            templateUrl: "js/templates/video/details.html",
            controller: "videoDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        /*.when("/videos/:video_id/edit", {
            templateUrl: "js/templates/video/edit.html",
            controller: "videoEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/video", {
            templateUrl: "js/templates/video/create.html",
            controller: "videoCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })*/

        // Overlays
        .when("/overlays", {
            templateUrl: "js/templates/overlay/list.html",
            controller: "overlayListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/overlays/:overlay_id", {
            templateUrl: "js/templates/overlay/details.html",
            controller: "overlayDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        /*.when("/overlays/:overlay_id/edit", {
            templateUrl: "js/templates/overlay/edit.html",
            controller: "overlayEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/video", {
            templateUrl: "js/templates/overlay/create.html",
            controller: "overlayCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })*/

        // Redirect
        .otherwise({
            redirectTo: "/"
        });

    $locationProvider.html5Mode(config.html5Mode);
});


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
