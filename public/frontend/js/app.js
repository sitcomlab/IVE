var app = angular.module("ive", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "pascalprecht.translate",
    "btford.socket-io",

    // Own Modules
    "routes",
    "languages",
    "sockets",

    // Services
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
