var app = angular.module("authenticationService", []);


// User service
app.factory('$authenticationService', function($http, $log, config) {

    var authenticated_user;

    return {
        init: function(){
            return {
                username: "admin", // TEST
                password: "admin" // TEST
            };
        },
        get: function(){
            return authenticated_user;
        },
        set: function(data){
            authenticated_user = data;
        },
        authenticated: function(){
            if(authenticated_user !== undefined){
                return true;
            } else {
                return false;
            }
        },
        setToken: function(data){
            token = data;
        },
        getToken: function(){
            if(token === undefined){
                return undefined;
            } else {
                return token;
            }
        },
        authenticate: function(data) {
            return $http.post(config.apiURL + "/login", data);
        }

    };

});
