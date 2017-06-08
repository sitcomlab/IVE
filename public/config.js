var app = angular.module("config", []);

/**
 * Constants
 */
app.constant("config", {
    appName: "IVE",
    appSubnames: {
        backend: "IVE | Backend",
        frontend: "IVE | Frontend",
        remote: "IVE | Remote control"
    },
    appDevelopers: [{
        name: "Nicholas Schiestel",
        github: "nicho90"
    }],
    appGithub: "https://github.com/sitcomlab/IVE",
    appVersion: "v2.0",
    appLanguage: 'en_US',
    appYear: moment().format("YYYY"),
    apiURL: "/api",
    debugMode: false,
    html5Mode: true
});
