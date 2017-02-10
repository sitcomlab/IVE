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
        .when("/scenarios/:scenario_id/edit", {
            templateUrl: "js/templates/scenario/edit.html",
            controller: "scenarioEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/scenarios/:scenario_id/delete", {
            templateUrl: "js/templates/scenario/delete.html",
            controller: "scenarioDeleteController",
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
        })

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
        .when("/locations/:location_id/edit", {
            templateUrl: "js/templates/location/edit.html",
            controller: "locationEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/locations/:location_id/delete", {
            templateUrl: "js/templates/location/delete.html",
            controller: "locationDeleteController",
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
        })

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
        .when("/videos/:video_id/edit", {
            templateUrl: "js/templates/video/edit.html",
            controller: "videoEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/videos/:video_id/delete", {
            templateUrl: "js/templates/video/delete.html",
            controller: "videoDeleteController",
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
        })

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
        .when("/overlays/:overlay_id/edit", {
            templateUrl: "js/templates/overlay/edit.html",
            controller: "overlayEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/overlays/:overlay_id/delete", {
            templateUrl: "js/templates/overlay/delete.html",
            controller: "overlayDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/overlay", {
            templateUrl: "js/templates/overlay/create.html",
            controller: "overlayCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })

        // Relationships
        .when("/relationships", {
            templateUrl: "js/templates/relationship/list.html",
            controller: "relationshipListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/belongs_to", {
            templateUrl: "js/templates/relationship/list/belongs_to.html",
            controller: "belongsToListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/connected_to", {
            templateUrl: "js/templates/relationship/list/connected_to.html",
            controller: "connectedToListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/embedded_in", {
            templateUrl: "js/templates/relationship/list/embedded_in.html",
            controller: "embeddedInListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/has_parent_location", {
            templateUrl: "js/templates/relationship/list/has_parent_location.html",
            controller: "hasParentLocationListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/recorded_at", {
            templateUrl: "js/templates/relationship/list/recorded_at.html",
            controller: "recordedAtListController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/belongs_to/:label/:relationship_id", {
            templateUrl: "js/templates/relationship/details/belongs_to.html",
            controller: "belongsToDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/connected_to/:relationship_id", {
            templateUrl: "js/templates/relationship/details/connected_to.html",
            controller: "connectedToDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/embedded_in/:relationship_id", {
            templateUrl: "js/templates/relationship/details/embedded_in.html",
            controller: "embeddedInDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/has_parent_location/:relationship_id", {
            templateUrl: "js/templates/relationship/details/has_parent_location.html",
            controller: "hasParentLocationDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/recorded_at/:relationship_id", {
            templateUrl: "js/templates/relationship/details/recorded_at.html",
            controller: "recordedAtDetailsController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/belongs_to/:label/:relationship_id/edit", {
            templateUrl: "js/templates/relationship/edit/belongs_to.html",
            controller: "belongsToEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/connected_to/:relationship_id/edit", {
            templateUrl: "js/templates/relationship/edit/connected_to.html",
            controller: "connectedToEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/embedded_in/:relationship_id/edit", {
            templateUrl: "js/templates/relationship/edit/embedded_in.html",
            controller: "embeddedInEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/has_parent_location/:relationship_id/edit", {
            templateUrl: "js/templates/relationship/edit/has_parent_location.html",
            controller: "hasParentLocationEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/recorded_at/:relationship_id/edit", {
            templateUrl: "js/templates/relationship/edit/recorded_at.html",
            controller: "recordedAtEditController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/embedded_in/:relationship_id/preview", {
            templateUrl: "js/templates/relationship/embedded_in_preview.html",
            controller: "embeddedInEditPreviewController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/belongs_to/:label/:relationship_id/delete", {
            templateUrl: "js/templates/relationship/delete/belongs_to.html",
            controller: "belongsToDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/connected_to/:relationship_id/delete", {
            templateUrl: "js/templates/relationship/delete/connected_to.html",
            controller: "connectedToDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/embedded_in/:relationship_id/delete", {
            templateUrl: "js/templates/relationship/delete/embedded_in.html",
            controller: "embeddedInDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/has_parent_location/:relationship_id/delete", {
            templateUrl: "js/templates/relationship/delete/has_parent_location.html",
            controller: "hasParentLocationDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/relationship/recorded_at/:relationship_id/delete", {
            templateUrl: "js/templates/relationship/delete/recorded_at.html",
            controller: "recordedAtDeleteController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/relationship", {
            templateUrl: "js/templates/relationship/create.html",
            controller: "relationshipCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/belongs_to/relationship", {
            templateUrl: "js/templates/relationship/create_belongs_to.html",
            controller: "relationshipCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/belongs_to/relationship/:label", {
            templateUrl: "js/templates/relationship/create/belongs_to.html",
            controller: "belongsToCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/connected_to/relationship", {
            templateUrl: "js/templates/relationship/create/connected_to.html",
            controller: "connectedToCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/embedded_in/relationship", {
            templateUrl: "js/templates/relationship/create/embedded_in.html",
            controller: "embeddedInCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/has_parent_location/relationship", {
            templateUrl: "js/templates/relationship/create/has_parent_location.html",
            controller: "hasParentLocationCreateController",
            resolve: {
                factory: checkAuthentication
            }
        })
        .when("/new/recorded_at/relationship", {
            templateUrl: "js/templates/relationship/create/recorded_at.html",
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
