/**
 * Socket Message Handler
 */
var colors = require('colors');
var io = require('./../server.js').io;
var logging = false;
var overlays = true;
var currentState = {"overlay":{}};
const { logState, clearLogs, exportLogs } = require('../controllers/actionLogger');

io.on('connection', function(socket) {

    // On connection
    console.log(colors.magenta(new Date() + " Socket connected: " +  socket.client.id));

    // On disconnection
    socket.on('disconnect', function() {
        console.log(colors.magenta(new Date() + " Socket disconnected: " +  socket.client.id));
    });

    // manage logging
    socket.on('/toggle/logging', async function() {
        // turn off logging
        if (logging) {
            logging = false;
            // read out existing logs
            let logs = await exportLogs()
            // and emit these logs to all the clients
            socket.emit('/get/logs', logs);
            socket.broadcast.emit('/get/logs', logs);
            clearLogs();
            console.log(colors.cyan(new Date() + " /set/scenario: logging off"));
        // turn on logging
        } else {
            logging = true;
            await clearLogs();
            // log the initial states (if they are not undefined)
            logState(currentState);
            console.log(new Date() + " /set/scenario: logging on");
        }
        // comunicate to the other clients if logging is on or off
        socket.broadcast.emit('/get/logstate', logging);
    });

    socket.on('/toggle/overlays', async function() {
        // turn off all overlays
        if (overlays) {
            overlays = false;
            for (const [key, value] of Object.entries(currentState.overlay)) {
                currentState.overlay[key] = false;
                let overlay = {
                    overlay_id: parseInt(key),
                    display: false
                }
                socket.broadcast.emit('/toggle/overlay', overlay);
                socket.emit('/toggle/overlay', overlay);
            };
        // turn on overlays
        } else {
            overlays = true;
        }
        // comunicate to the other clients if logging is on or off
        socket.emit('/get/overlaystate', overlays);
    });

    // Return current State as an object
    socket.on('/get/state', function() {
        socket.emit('/get/state', currentState);
    });

    // Return if logging is on or off
    socket.on('/get/logstate', function() {
        socket.emit('/get/logstate', logging);
    });

    // Return if logging is on or off
    socket.on('/get/overlaystate', function() {
        socket.emit('/get/overlaystate', overlays);
    });

    // Scenario
    socket.on('/set/scenario', function(data) {
        console.log(colors.cyan(new Date() + " /set/scenario: " + JSON.stringify(data)));
        currentState.scenario = data;
        if (logging) logState(currentState);
        socket.broadcast.emit('/set/scenario', data);
    });

    // Location
    socket.on('/set/location', function(data) {
        console.log(colors.cyan(new Date() + " /set/location: " + JSON.stringify(data)));
        // set location
        currentState.location = data;
        // reset video and overlays
        currentState.video = undefined;
        currentState.overlay = {};
        if (logging) logState(currentState);
        socket.broadcast.emit('/set/location', data);
    });

    // Video
    socket.on('/set/video', function(data) {
        console.log(colors.cyan(new Date() + " /set/video: " + JSON.stringify(data)));
        let prevId = ((typeof currentState.video == 'undefined') ? undefined : currentState.video.video_id);
        // set video
        currentState.video = data;
        // set overlay
        currentState.overlay = {};
        data.overlays.forEach(element => {
            element.display = (overlays) ? element.display : overlays
            currentState.overlay[element.overlay_id] = element.display;
        });
        if (logging) {
            let currId = ((typeof data == 'undefined') ? undefined : data.video_id);
            if (prevId != currId) logState(currentState);
        }
        socket.emit('/set/video', data);
        socket.broadcast.emit('/set/video', data);
    });

    // Show/Hide Overlay
    socket.on('/toggle/overlay', function(data) {
        console.log(colors.cyan(new Date() + " /toggle/overlay: " + JSON.stringify(data)));
        data.display = (overlays) ? data.display : overlays
        currentState.overlay[data.overlay_id] = data.display;
        logState(currentState);
        socket.emit('/toggle/overlay', data);
        socket.broadcast.emit('/toggle/overlay', data);
    });

    // Live changing of the overlay values; change values of overlays (rotation, position, ...)
    socket.on('/change/values', function(data) {
        console.log(colors.cyan(new Date() + " /change/values: " + JSON.stringify(data)));
        socket.broadcast.emit('/change/values', data);
    });

    // Reload the scene in the viewer with new values; save changes at overlays
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
