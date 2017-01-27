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

        // Scenarios
        /*.when("/scenarios", {
            templateUrl: "js/templates/scenarios/list.html",
            controller: "scenarioListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/scenarios/:scenario_id", {
            templateUrl: "js/templates/scenarios/details.html",
            controller: "scenarioDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/scenarios/:scenario_id/edit", {
            templateUrl: "js/templates/scenarios/edit.html",
            controller: "scenarioEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/scenario", {
            templateUrl: "js/templates/scenarios/create.html",
            controller: "scenarioCreateController",
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
