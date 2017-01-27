var app = angular.module("config", []);

/**
 * Constants
 */
app.constant("config", {
    appName: "IVE",
    appSubname: "Frontend",
    appDevelopers: [{
        name: "Nicholas Schiestel",
        github: "nicho90"
    }],
    appGithub: "https://github.com/sitcomlab/IVE",
    appVersion: "v2.0",
    appLanguage: 'en_US',
    apiURL: "/api",
    debugMode: false,
    html5Mode: true
});
