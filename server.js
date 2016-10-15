var colors = require('colors');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var neo4j = require('neo4j-driver').v1;
// var pg = require('pg');


var app = express();
var httpPort = process.env.PORT || 5000;
var httpsPort = httpPort + 443;
var username = process.env.USERNAME || 'neo4j';
var password = process.env.PW || 'neo4j';
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic(username, password));
exports.driver = driver;
var session = driver.session();
var query = "RETURN true;";
session
    .run(query)
    .then(function(result) {
        session.close();
        console.log(colors.green(new Date() + " Neo4j is running on Port 7474"));
    })
    .catch(function(err) {
        //console.error(err);
        console.log(colors.red(new Date() + " Neo4j could not been accessed!"));
    });

// Setup settings
app.use(bodyParser.json({
    limit: 52428800 // 50MB
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: 52428800 // 50MB
}));

// Set folder for static files
app.use(express.static(__dirname + '/public'));


// Load dependencies
var scenarios = require('./routes/scenarios');
var locations = require('./routes/locations');
var videos = require('./routes/videos');
var overlays = require('./routes/overlays');

// Load Routes
app.use('/api', scenarios);
app.use('/api', locations);
app.use('/api', videos);
app.use('/api', overlays);


// Start Webserver
var httpServer = http.createServer(app);
httpServer.listen(httpPort, function() {
    console.log(colors.green(new Date() + " HTTP-Server is listening at port " + httpPort));
});


var io = require('socket.io')(httpServer);
exports.io = io;
var sockets = require('./sockets/sockets.js').sockets;
console.log(colors.green(new Date() + " Websocket-Server listening"));
