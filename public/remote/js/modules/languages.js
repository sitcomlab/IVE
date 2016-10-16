var app = angular.module("languages", [ "config" ]);

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
        START_LOCATION: 'Start location'

    });


    // Set Default Language
    $translateProvider.preferredLanguage(config.appLanguage);
});
