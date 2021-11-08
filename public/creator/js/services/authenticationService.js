const user_storage_key = 'AUTH_USER';

var app = angular.module("authenticationService", []);

// User service
app.factory('$authenticationService', function($http, $log, config) {

    let authenticated_user = JSON.parse(localStorage.getItem(user_storage_key));

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
            return !!authenticated_user;
        },
        getToken: function(){
            if (authenticated_user) return authenticated_user.token
        },
        getRefreshToken: function(){
            if (authenticated_user) return authenticated_user.refreshToken
        },
        login: function(data) {
            // NOTE: we don't handle refreshing the token, so we may store expired tokens..
            // but the backend doesnt implement a route to refresh a token yet
            return $http.post(config.getApiEndpoint() + "/login", data)
                .then(res => { 
                    authenticated_user = res.data;
                    localStorage.setItem(user_storage_key, JSON.stringify(authenticated_user));
                    return res.data;
                })
        },
        updateUser: function(data) {
            authenticated_user = data;
            localStorage.setItem(user_storage_key, JSON.stringify(authenticated_user));
        },
        logout: function(){
            authenticated_user = null;
            localStorage.removeItem(user_storage_key);
        }
    };
});
