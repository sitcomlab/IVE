/**
 * Socket Message Handler
 */
var colors = require('colors');
var io = require('./../server.js').io;
io.on('connection', function(socket) {

    // On connection
    console.log(colors.magenta(new Date() + " Socket connected: " +  socket.client.id));

    // On disconnection
    socket.on('disconnect', function() {
        console.log(colors.magenta(new Date() + " Socket disconnected: " +  socket.client.id));
    });

    // Scenario
    socket.on('/set/scenario', function(data) {
        console.log(colors.cyan(new Date() + " /set/scenario: " + JSON.stringify(data)));
        socket.broadcast.emit('/set/scenario', data);
    });

    // Location
    socket.on('/set/location', function(data) {
        console.log(colors.cyan(new Date() + " /set/location: " + JSON.stringify(data)));
        socket.broadcast.emit('/set/location', data);
    });

    // Video
    socket.on('/set/video', function(data) {
        console.log(colors.cyan(new Date() + " /set/video: " + JSON.stringify(data)));
        socket.broadcast.emit('/set/video', data);
    });

    // Show/Hide Overlay
    socket.on('/toggle/overlay', function(data) {
        console.log(colors.cyan(new Date() + " /toggle/overlay: " + JSON.stringify(data)));
        socket.broadcast.emit('/toggle/overlay', data);
    });

    // Live changing of the overlay values
    socket.on('/change/values', function(data) {
        console.log(colors.cyan(new Date() + " /change/values: " + JSON.stringify(data)));
        socket.broadcast.emit('/change/values', data);
    });

    // Reload the scene in the viewer with new values
    socket.on('/change/saveValues', function(data) {
        console.log(colors.cyan(new Date() + " /change/saveValues: " + JSON.stringify(data)));
        socket.broadcast.emit('/change/saveValues', data);
    });

    // Switch the point overlay on and off
    socket.on('/toggle/pointing', function(data) {
        console.log(colors.cyan(new Date() + " /toggle/pointing: " + JSON.stringify(data)));
        socket.broadcast.emit('/toggle/pointing', data);
    });

});

exports.sockets = io;
