var app = angular.module("sockets", []);

/**
 * Sockets
 */
app.factory('$socket', function(socketFactory) {
    return socketFactory();
});
