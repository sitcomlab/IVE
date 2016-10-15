/**
 * Socket Message Handler
 */
var io = require('./../server.js').io;
io.on('connection', function(socket) {

    // On connection
    console.log(colors.magenta("Socket connected:", socket.client.id));

    // On disconnection
    socket.on('disconnect', function() {
        console.log(colors.magenta("Socket disconnected:", socket.client.id));
    });

    // Scenario
    socket.on('/set/scenario', function(data) {
        console.log(colors.cyan("Set scenario: ",  data));
        socket.emit('/set/scenascenariorio', data);
    });

    // Location
    socket.on('/set/location', function(data) {
        console.log(colors.cyan("Set location: ", data));
        socket.emit('/set/location', data);
    });

    // Video
    socket.on('/set/video', function(data) {
        console.log(colors.cyan("Set video: ", data));
        socket.emit('/set/video', data);
    });

    // Show/Hide Overlay
    socket.on('/toggle/overlay', function(data) {
        console.log(colors.cyan("Toggle overlay: ", data));
        socket.emit('/toggle/overlay', data);
    });

});

exports.sockets = io;
