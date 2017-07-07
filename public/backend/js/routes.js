var app = angular.module("routes", []);

/**
 * Route Provider
 */
app.config(function($routeProvider, $locationProvider, config) {
    $routeProvider

        // Home (Login)
        .when("/", {
            templateUrl: "templates/login.html",
            controller: "loginController"
        })
        .when("/help", {
            templateUrl: "templates/help.html",
            controller: "helpController"
        })

        // Map
        .when("/map", {
            templateUrl: "templates/map.html",
            controller: "mapController",
            resolve: {
                factory: checkAuthentication
            }
        })

        // Scenarios
        .when("/scenarios", {
            templateUrl: "templates/scenario/list.html",
            controller: "scenarioListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/scenarios/:scenario_id", {
            templateUrl: "templates/scenario/details.html",
            controller: "scenarioDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/scenarios/:scenario_id/edit", {
            templateUrl: "templates/scenario/edit.html",
            controller: "scenarioEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/scenarios/:scenario_id/delete", {
            templateUrl: "templates/scenario/delete.html",
            controller: "scenarioDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/scenario", {
            templateUrl: "templates/scenario/create.html",
            controller: "scenarioCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })

        // Locations
        .when("/locations", {
            templateUrl: "templates/location/list.html",
            controller: "locationListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/locations/:location_id", {
            templateUrl: "templates/location/details.html",
            controller: "locationDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/locations/:location_id/edit", {
            templateUrl: "templates/location/edit.html",
            controller: "locationEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/locations/:location_id/delete", {
            templateUrl: "templates/location/delete.html",
            controller: "locationDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/location", {
            templateUrl: "templates/location/create.html",
            controller: "locationCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })

        // Videos
        .when("/videos", {
            templateUrl: "templates/video/list.html",
            controller: "videoListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/videos/:video_id", {
            templateUrl: "templates/video/details.html",
            controller: "videoDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/videos/:video_id/edit", {
            templateUrl: "templates/video/edit.html",
            controller: "videoEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/videos/:video_id/delete", {
            templateUrl: "templates/video/delete.html",
            controller: "videoDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/video", {
            templateUrl: "templates/video/create.html",
            controller: "videoCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })

        // Overlays
        .when("/overlays", {
            templateUrl: "templates/overlay/list.html",
            controller: "overlayListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/overlays/:overlay_id", {
            templateUrl: "templates/overlay/details.html",
            controller: "overlayDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/overlays/:overlay_id/edit", {
            templateUrl: "templates/overlay/edit.html",
            controller: "overlayEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/overlays/:overlay_id/delete", {
            templateUrl: "templates/overlay/delete.html",
            controller: "overlayDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/overlay", {
            templateUrl: "templates/overlay/create.html",
            controller: "overlayCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })

        // Relationships
        .when("/relationships", {
            templateUrl: "templates/relationship/select.html",
            controller: "relationshipSelectController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationships/:relationship_label", {
            templateUrl: "templates/relationship/list.html",
            controller: "relationshipListController",
            resolve: {
                factory: checkAuthentication
            }
        })

        .when("/relationships/:relationship_label/:relationship_id/", {
            templateUrl: "templates/relationship/details.html",
            controller: "relationshipDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationships/:relationship_label/:relationship_id/:relationship_type", {
            templateUrl: "templates/relationship/details.html",
            controller: "relationshipDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })

        .when("/edit/relationships/:relationship_label/:relationship_id/", {
            templateUrl: "templates/relationship/edit.html",
            controller: "relationshipEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/edit/relationships/:relationship_label/:relationship_id/:relationship_type", {
            templateUrl: "templates/relationship/edit.html",
            controller: "relationshipEditController",
            resolve: {
                factory: checkAuthentication
            }
        })

        .when("/delete/relationships/:relationship_label/:relationship_id/", {
            templateUrl: "templates/relationship/delete.html",
            controller: "relationshipDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/delete/relationships/:relationship_label/:relationship_id/:relationship_type", {
            templateUrl: "templates/relationship/delete.html",
            controller: "relationshipDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })

        .when("/new/relationship", {
            templateUrl: "templates/relationship/create.html",
            controller: "relationshipCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/belongs_to/relationship", {
            templateUrl: "templates/relationship/select_belongs_to.html",
            controller: "relationshipCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/belongs_to/relationship/:relationship_type", {
            templateUrl: "templates/relationship/create/belongs_to.html",
            controller: "belongsToCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/connected_to/relationship", {
            templateUrl: "templates/relationship/create/connected_to.html",
            controller: "connectedToCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/embedded_in/relationship", {
            templateUrl: "templates/relationship/create/embedded_in.html",
            controller: "embeddedInCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/has_parent_location/relationship", {
            templateUrl: "templates/relationship/create/has_parent_location.html",
            controller: "hasParentLocationCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/recorded_at/relationship", {
            templateUrl: "templates/relationship/create/recorded_at.html",
            controller: "recordedAtCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })


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
