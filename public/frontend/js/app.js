var app = angular.module("ive", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "ngSanitize",
    "pascalprecht.translate",
    "angular-momentjs",
    "btford.socket-io",
    "underscore",
	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	//"com.2fdevs.videogular.plugins.overlayplay",
	//"com.2fdevs.videogular.plugins.poster"

    // Own Modules
    "routes",
    "languages",
    "sockets",

    // Services
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
