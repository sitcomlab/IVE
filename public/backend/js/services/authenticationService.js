var app = angular.module("authenticationService", []);


// User service
app.factory('$authenticationService', function($http, $log, config) {

    var authenticated_user;

    return {
        init: function(){
            return {
                username: "",
                password: ""
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
            authenticated_user.token = data;
        },
        getToken: function(){
            if(authenticated_user !== undefined){
                if(authenticated_user.token !== undefined){
                    return authenticated_user.token;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        },
        authenticate: function(data) {
            return $http.post(config.apiURL + "/login", data);
        }

    };

});
