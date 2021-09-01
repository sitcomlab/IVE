var app = angular.module("routes", []);

/**
 * Route Provider
 */
app.config(function($routeProvider, $locationProvider, config) {
    $routeProvider

        .when("/", { redirectTo: "/map" })

        // Map
        .when("/map", {
            templateUrl: "templates/map.html",
            controller: "mapController",
        })

        // Scenarios
        .when("/scenarios", {
            templateUrl: "templates/scenario/list.html",
            controller: "scenarioListController",
        })
        .when("/scenarios/:scenario_id", {
            templateUrl: "templates/scenario/details.html",
            controller: "scenarioDetailsController",
        })
        .when("/scenarios/:scenario_id/edit", {
            templateUrl: "templates/scenario/edit.html",
            controller: "scenarioEditController",
        })
        .when("/scenarios/:scenario_id/delete", {
            templateUrl: "templates/scenario/delete.html",
            controller: "scenarioDeleteController",
        })
        .when("/create/scenario", {
            templateUrl: "templates/scenario/create.html",
            controller: "scenarioCreateController",
        })

        // Locations
        .when("/locations", {
            templateUrl: "templates/location/list.html",
            controller: "locationListController",
        })
        .when("/locations/:location_id", {
            templateUrl: "templates/location/details.html",
            controller: "locationDetailsController",
        })
        .when("/locations/:location_id/edit", {
            templateUrl: "templates/location/edit.html",
            controller: "locationEditController",
        })
        .when("/locations/:location_id/delete", {
            templateUrl: "templates/location/delete.html",
            controller: "locationDeleteController",
        })
        .when("/create/location", {
            templateUrl: "templates/location/create.html",
            controller: "locationCreateController",
        })

        // Videos
        .when("/videos", {
            templateUrl: "templates/video/list.html",
            controller: "videoListController",
        })
        .when("/videos/:video_id", {
            templateUrl: "templates/video/details.html",
            controller: "videoDetailsController",
        })
        .when("/videos/:video_id/edit", {
            templateUrl: "templates/video/edit.html",
            controller: "videoEditController",
        })
        .when("/videos/:video_id/delete", {
            templateUrl: "templates/video/delete.html",
            controller: "videoDeleteController",
        })
        .when("/create/video", {
            templateUrl: "templates/video/create.html",
            controller: "videoCreateController",
        })

        // Overlays
        .when("/overlays", {
            templateUrl: "templates/overlay/list.html",
            controller: "overlayListController",
        })
        .when("/overlays/:overlay_id", {
            templateUrl: "templates/overlay/details.html",
            controller: "overlayDetailsController",
        })
        .when("/overlays/:overlay_id/edit", {
            templateUrl: "templates/overlay/edit.html",
            controller: "overlayEditController",
        })
        .when("/overlays/:overlay_id/delete", {
            templateUrl: "templates/overlay/delete.html",
            controller: "overlayDeleteController",
        })
        .when("/create/overlay", {
            templateUrl: "templates/overlay/create.html",
            controller: "overlayCreateController",
        })

        // Relationships
        .when("/relationships", {
            templateUrl: "templates/relationship/select.html",
            controller: "relationshipSelectController",
        })
        .when("/relationships/:relationship_label", {
            templateUrl: "templates/relationship/list.html",
            controller: "relationshipListController",
        })
        .when("/relationships/:relationship_label/:relationship_id/", {
            templateUrl: "templates/relationship/details.html",
            controller: "relationshipDetailsController",
        })
        .when("/relationships/:relationship_label/:relationship_id/:relationship_type", {
            templateUrl: "templates/relationship/details.html",
            controller: "relationshipDetailsController",
        })
        .when("/edit/relationships/embedded_in/:relationship_id/", {
            templateUrl: "templates/relationship/edit/embedded_in.html",
            controller: "embeddedInEditController",
        })
        .when("/edit_in_preview/relationships/embedded_in/:relationship_id/", {
            templateUrl: "templates/relationship/edit/embedded_in_preview.html",
            controller: "embeddedInEditPreviewController",
        })
        .when("/edit/relationships/recorded_at/:relationship_id/", {
            templateUrl: "templates/relationship/edit/recorded_at.html",
            controller: "recordedAtEditController",
        })

        .when("/delete/relationships/:relationship_label/:relationship_id/", {
            templateUrl: "templates/relationship/delete.html",
            controller: "relationshipDeleteController",
        })
        .when("/delete/relationships/:relationship_label/:relationship_id/:relationship_type", {
            templateUrl: "templates/relationship/delete.html",
            controller: "relationshipDeleteController",
        })

        .when("/create/relationship", {
            templateUrl: "templates/relationship/create.html",
            controller: "relationshipCreateController",
        })
        .when("/create/belongs_to/relationship", {
            templateUrl: "templates/relationship/select_belongs_to.html",
            controller: "relationshipCreateController",
        })
        .when("/create/belongs_to/relationship/:relationship_type", {
            templateUrl: "templates/relationship/create/belongs_to.html",
            controller: "belongsToCreateController",
        })
        .when("/create/connected_to/relationship", {
            templateUrl: "templates/relationship/create/connected_to.html",
            controller: "connectedToCreateController",
        })
        .when("/create/embedded_in/relationship", {
            templateUrl: "templates/relationship/create/embedded_in.html",
            controller: "embeddedInCreateController",
        })
        .when("/create/has_parent_location/relationship", {
            templateUrl: "templates/relationship/create/has_parent_location.html",
            controller: "hasParentLocationCreateController",
        })
        .when("/create/recorded_at/relationship", {
            templateUrl: "templates/relationship/create/recorded_at.html",
            controller: "recordedAtCreateController",
        })


        // Redirect
        .otherwise({ redirectTo: "/map" });

    $locationProvider.html5Mode(config.html5Mode);
});
