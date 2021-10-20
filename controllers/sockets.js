/**
 * Socket Message Handler
 */
var colors = require('colors');
var io = require('./../server.js').io;
var logging = false;
var currentState = {"overlay":{}};
const { logChange, clearLogs, exportLogs } = require('../controllers/actionLogger');

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
        } else {
            logging = true;
            clearLogs();
            // log the initial states (if they are not undefined)
            if (typeof currentState.scenario != 'undefined') // scenario
            {
                logChange(
                    "Scenario",
                    undefined,
                    currentState.scenario.scenario_id);
                if (typeof currentState.location != 'undefined') // location
                {
                    logChange(
                        "Location",
                        undefined,
                        currentState.location.location_id);
                    if (typeof currentState.video != 'undefined') // video
                    {
                        logChange(
                            "Location",
                            undefined,
                            currentState.video.video_id);
                    }
                }
            }
            console.log(new Date() + " /set/scenario: logging on");
        }
        // comunicate to the other clients if logging is on or off
        socket.broadcast.emit('/get/logstate', logging);
    });

    // Return current State as an object
    socket.on('/get/state', function() {
        socket.emit('/get/state', currentState);
    });

    // Return if logging is on or off
    socket.on('/get/logstate', function() {
        socket.emit('/get/logstate', logging);
    });

    // Scenario
    socket.on('/set/scenario', function(data) {
        console.log(colors.cyan(new Date() + " /set/scenario: " + JSON.stringify(data)));
        if (logging) {
            logChange(
                "Scenario",
                ((typeof currentState.scenario == 'undefined') ? undefined : currentState.scenario.scenario_id), 
                ((typeof data == 'undefined') ? undefined : data.scenario_id));
        }
        currentState.scenario = data;
        socket.broadcast.emit('/set/scenario', data);
    });

    // Location
    socket.on('/set/location', function(data) {
        console.log(colors.cyan(new Date() + " /set/location: " + JSON.stringify(data)));
        if (logging) {
            logChange(
                "Location",
                ((typeof currentState.location == 'undefined') ? undefined : currentState.location.location_id), 
                ((typeof data == 'undefined') ? undefined : data.location_id));
        }
        currentState.location = data;
        socket.broadcast.emit('/set/location', data);
    });

    // Video
    socket.on('/set/video', function(data) {
        console.log(colors.cyan(new Date() + " /set/video: " + JSON.stringify(data)));
        if (logging) {
            let prevId = ((typeof currentState.video == 'undefined') ? undefined : currentState.video.video_id);
            let currId = ((typeof data == 'undefined') ? undefined : data.video_id);
            if (prevId != currId) {
            logChange(
                "Video",
                prevId, 
                currId);
            }
        }
        currentState.video = data;
        socket.broadcast.emit('/set/video', data);
    });

    // Show/Hide Overlay
    socket.on('/toggle/overlay', function(data) {
        console.log(colors.cyan(new Date() + " /toggle/overlay: " + JSON.stringify(data)));
        currentState.overlay[data.overlay_id] = data.display;
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
