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
    // apiURL: "http://f3e6c7de.ngrok.io/api",
    imageFolder: '/images',
    videoFolder: '/videos',
    debugMode: true,
    html5Mode: true,
    creatorLogin: {
        username: 'admin',
        password: 'admin'
    },
    thumbnailFolder: '/thumbnails',
    thumbnailSpeed: 50
});
