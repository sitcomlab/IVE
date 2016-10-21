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

        PLEASE_SELECT_A: 'Please select a',
        SCENARIO: 'Scenario',
        LOCATION: 'Location',
        START_LOCATION: 'start location',
        NO_VIDEO_FOUND: 'No video found'
    });


    // Set Default Language
    $translateProvider.preferredLanguage(config.appLanguage);
    $translateProvider.useSanitizeValueStrategy('sanitize');
});
