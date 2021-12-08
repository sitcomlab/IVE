var app = angular.module("config", []);

/**
 * Constants
 */
app.constant("config", {
    appName: "IVE",
    appSubnames: {
        creator: "IVE | Creator",
        viewer: "IVE | Viewer",
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
    debugMode: false,
    html5Mode: true,
    limit: 7,
    mapboxStaticAPI: 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/',
    mapboxAccessToken: 'pk.eyJ1Ijoic2l0Y29tbGFiIiwiYSI6ImNqNjd4a3pkdTA5ZmkyemxzNjBvZWQ0ZGcifQ.ctIXrv-GP4kWn7uMdt4yPQ',
    imageFolder: '/images',
    videoFolder: '/videos',
    thumbnailFolder: '/thumbnails',
    thumbnailSpeed: 50,
    walkingSpeed: 6, // meters per second
    serverMode: 'development',
    serverSettings: {
        development: {
            host: 'http://localhost',
            port: 5000,
            apiPath: "/api"
        },
        production: {
            host: 'http://localhost',
            port: 80,
            apiPath: "/api"
        }
    },
    getApiEndpoint: function(){
        if(this.serverMode === 'production'){
            return this.serverSettings.production.host + ":" + this.serverSettings.production.port + this.serverSettings.production.apiPath
        } else {
            // var ngrok = "http://06155e67.ngrok.io/api";
            // return ngrok;
            return this.serverSettings.development.host + ":" + this.serverSettings.development.port + this.serverSettings.development.apiPath
        }
    }
});
