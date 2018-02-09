var app = angular.module("config", []);

/**
 * Constants
 */
app.constant("config", {
    appName: "IVE",
    appSubname: "CMS",
    appDevelopers: [{
        name: "Nico Steffens",
        github: "nsteffens"
    }],
    appGithub: "https://github.com/nsteffens/IVE",
    appVersion: "v1.0",
    appLanguage: 'en_US',
    appYear: moment().format("YYYY"),
    apiURL: "http://localhost:5000/api",
    debugMode: true,
    html5Mode: true,
    backendLogin: {
        username: 'admin',
        password: 'admin'
    },
    thumbnailSpeed: 50
});