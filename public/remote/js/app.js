var app = angular.module("ive", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "pascalprecht.translate",

    // Own Modules
    "filters",
    "routes",
    "languages",

    // Services
    "scenarioService",
    "locationService",
    "videoService"

]);


/**
 * Log Provider
 * turn on/off debug logging
 */
app.config(function($logProvider) {
    $logProvider.debugEnabled(false);
});


/**
 * Start application
 */
app.run(function($translate, config) {

    // Use Translator and set Language
    $translate.use(config.appLanguage);

});
