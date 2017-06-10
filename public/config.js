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
    debugMode: false,
    html5Mode: true,
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
            return this.serverSettings.development.host + ":" + this.serverSettings.development.port + this.serverSettings.development.apiPath
        }
    },
});
