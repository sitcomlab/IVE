var app = angular.module("ive_cms", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "ngSanitize",
    // "pascalprecht.translate",
    "angular-momentjs",
    "ui-leaflet",

    // Videogular
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",

    // Own Modules
    "routes",
    // "languages",
    "filters",

    // Services

    "authenticationService",
    "scenarioService",
    "locationService",
    "videoService",
    "overlayService",
    "relationshipService",

    // Upload framework
    "ngFileUpload"

]);

/**
 * Log Provider
 * turn on/off debug logging
 */
app.config(function ($logProvider, config) {
    $logProvider.debugEnabled(config.debugMode);
});

/**
 * Start application
 */
app.run(function (config) {

});