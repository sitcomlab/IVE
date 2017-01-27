var app = angular.module("languages", []);

/**
 * Translate Provider
 */
app.config(function($translateProvider, config) {

    /**
     * German
     */
    $translateProvider.translations('de_DE', {
        // TODO: translations
    });


    /**
     * English
     */
    $translateProvider.translations('en_US', {
        
    });


    // Set Default Language
    $translateProvider.preferredLanguage(config.appLanguage);
    $translateProvider.useSanitizeValueStrategy('sanitize');
});
