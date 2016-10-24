var app = angular.module("ive", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "ngSanitize",
    "pascalprecht.translate",
    "btford.socket-io",

    // Own Modules
    "routes",
    "languages",
    "sockets",

    // Services
    "scenarioService",
    "locationService",
    "videoService",
    "overlayService"

]);


/**
 * Log Provider
 * turn on/off debug logging
 */
app.config(function($logProvider, config) {
    $logProvider.debugEnabled(config.debugMode);
});


/**
 * Start application
 */
app.run(function($translate, config) {

    // Use Translator and set Language
    $translate.use(config.appLanguage);

});
