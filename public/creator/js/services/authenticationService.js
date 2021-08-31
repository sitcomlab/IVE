const user_storage_key = 'AUTH_USER';

var app = angular.module("authenticationService", []);

// User service
app.factory('$authenticationService', function($http, $log, config) {

    let authenticated_user = JSON.parse(localStorage.getItem(user_storage_key));

    return {
        init: function(){
            return {
                username: "admin",
                password: "admin"
            };
        },
        get: function(){
            return authenticated_user;
        },
        set: function(data){
            authenticated_user = data;
        },
        authenticated: function(){
            return !!authenticated_user;
        },
        login: function(data) {
            return $http.post(config.getApiEndpoint() + "/login", data)
                .then(res => { 
                    authenticated_user = res.data;
                    localStorage.setItem(user_storage_key, JSON.stringify(authenticated_user));
                    return res.data;
                })
        },
        logout: function(){
            authenticated_user = null;
            localStorage.removeItem(user_storage_key);
        }
    };
});
