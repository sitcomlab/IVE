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
        CHANGE_CURRENT: 'Change current',
        SCENARIO: 'Scenario',
        LOCATION: 'Location',
        VIDEOS: 'Videos',
        OVERLAYS: 'Overlays',
        SETTINGS: 'Settings',
        START_LOCATION: 'start location',
        CONNECTED_LOCATIONS: 'Connected locations',
        NO_SCENARIOS_FOUND: 'No scenarios found',
        NO_LOCATIONS_FOUND: 'No locations found',
        NO_CONNECTED_LOCATIONS_FOUND: 'No connected locations found',
        NO_VIDEOS_FOUND: 'No videos found',
        NO_OVERLAYS_FOUND: 'No overlays found'
    });


    // Set Default Language
    $translateProvider.preferredLanguage(config.appLanguage);
    $translateProvider.useSanitizeValueStrategy('sanitize');
});
