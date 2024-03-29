var app = angular.module("ive", [

    // Import translations
    "en_US",
    "de_DE",

    // Import app settings
    "config",

    // Import external modules (libraries)
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

    // Import own modules
    "routes",
    "sockets",

    // Import services
    "videoService",
    "overlayService",
    "relationshipService",
    "authenticationService",
    "locationService"

]);


/**
 * Configurating application before starting
 */
app.config(function($logProvider, $translateProvider, en_US, de_DE, config) {
    // Logging
    $logProvider.debugEnabled(config.debugMode);

    // Translations
    $translateProvider.translations('en_US', en_US);
    $translateProvider.translations('de_DE', de_DE);

    // Set default language
    $translateProvider.preferredLanguage(config.appLanguage);
    $translateProvider.useSanitizeValueStrategy('sanitize');
});


/**
 * Start application
 */
app.run(function($translate, $rootScope, config, en_US) {
    $rootScope.config = config;

    // Run with default language
    $translate.use(config.appLanguage);
});
