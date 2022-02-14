/**
 * Socket Message Handler
 */
var colors = require('colors');
var io = require('./../server.js').io;
var logging = false;
var currentState = {"overlay":{}, "overlaysstate":true};
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
            clearLogs();
            // log the initial states (if they are not undefined)
            logState(currentState);
            console.log(new Date() + " /set/scenario: logging on");
        }
        // comunicate to the other clients if logging is on or off
        socket.broadcast.emit('/get/logstate', logging);
    });

    socket.on('/toggle/overlays', async function() {
        // turn off all overlays
        if (currentState.overlaysstate) {
            for (const [key, value] of Object.entries(currentState.overlay)) {
                let currentOverlay = currentState.overlay[key];
                if (currentOverlay.category != "distance") {
                    currentOverlay.display = false;
                    let overlay = {
                        overlay_id: parseInt(key),
                        display: false,
                        default: currentOverlay.default
                    }
                    socket.broadcast.emit('/toggle/overlay', overlay);
                    socket.emit('/toggle/overlay', overlay);
                }
            };
            currentState.overlaysstate = false;
        // turn on overlays
        } else {
            for (const [key, value] of Object.entries(currentState.overlay)) {
                let currentOverlay = currentState.overlay[key];
                if (currentOverlay.category != "distance") {
                    currentOverlay.display = currentOverlay.default;
                    let overlay = {
                        overlay_id: parseInt(key),
                        display: currentOverlay.default,
                        default: currentOverlay.default
                    }
                    socket.broadcast.emit('/toggle/overlay', overlay);
                    socket.emit('/toggle/overlay', overlay);
                }
            };
            currentState.overlaysstate = true;
        }
        // log that the overlays have been turned off
        if (logging) logState(currentState);
        // send the data to the other clients
        socket.broadcast.emit('/get/overlaysstate', currentState.overlaysstate);
        // the data has to be sent back to the client where it came from in case the overlays were all turned off
        socket.emit('/get/overlaysstate', currentState.overlaysstate);
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
    socket.on('/get/overlaysstate', function() {
        socket.emit('/get/overlaysstate', currentState.overlaysstate);
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
        // switch of location logging, to not have duplicate entries (since all locations have preferred videos and therefore the video will trigger a log entry)
        // if (logging) logState(currentState);
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
            // when the video is loaded from the database it only has the property "display" but this actually is the default value 
            // So when this is called and the default is undefined it should be set to the value of the given "display"
            element.default = (typeof element.default == "undefined") ? element.display : element.default
            // if all overlays are turned of the display value should also be set to false
            element.display = (currentState.overlaysstate) ? element.display : currentState.overlaysstate;
            currentState.overlay[element.overlay_id] = {
                display: element.display,
                default: element.default,
                category: element.category,
                name: element.name,
                title: element.title,
                distance_meters: element.distance_meters,
                distance_seconds: element.distance_seconds,
            }
        });
        if (logging) {
            let currId = ((typeof data == 'undefined') ? undefined : data.video_id);
            if (prevId != currId) logState(currentState);
        }

        data.length = currentState.location.length;
        
        socket.broadcast.emit('/set/video', data);
        // the data has to be sent back to the client where it came from in case the overlays were all turned off
        socket.emit('/set/video', data);
    });

    // Show/Hide Overlay
    socket.on('/toggle/overlay', function(data) {
        console.log(colors.cyan(new Date() + " /toggle/overlay: " + JSON.stringify(data)));
        // if all overlays are turned of the display value should also be set to false
        data.display = (currentState.overlaysstate || currentState.overlay[data.overlay_id].category == "distance") ? data.display : currentState.overlaysstate
        currentState.overlay[data.overlay_id].display = data.display;
        logState(currentState);
        // send the data to the other clients
        socket.broadcast.emit('/toggle/overlay', data);
        // the data has to be sent back to the client where it came from in case the overlays were all turned off
        socket.emit('/toggle/overlay', data);
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
