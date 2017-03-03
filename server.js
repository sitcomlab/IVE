var colors = require('colors');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var path = require('path');
var neo4j = require('neo4j-driver').v1;
var jwt = require('jsonwebtoken');


// Create server
var app = express();
var environment = process.env.NODE_ENV || 'development';
var server_url = process.env.SERVER_URL || 'http://giv-sitcomdev.uni-muenster.de';
var httpPort = process.env.HTTP_PORT || 5000;
var httpsPort = process.env.HTTPS_PORT || (httpPort + 443);
var neo4j_host = process.env.NEO4J_HOST || '127.0.0.1';
var neo4j_port = process.env.NEO4J_PORT || '7687';
var neo4j_username = process.env.NEO4J_USERNAME || 'neo4j';
var neo4j_password = process.env.NEO4J_PASSWORD || '123456';
var backend_username = process.env.BACKEND_USERNAME || 'admin';
var backend_password = process.env.BACKEND_PASSWORD || 'admin';
var jwtSecret = process.env.JWTSECRET || 'superSecretKey';
exports.server_url = server_url;
exports.jwtSecret = jwtSecret;
var account = {
    username: backend_username,
    password: backend_password
};
exports.account = account;

// Connect to Neo4j
var driver = neo4j.driver("bolt://" + neo4j_host + ":" + neo4j_port, neo4j.auth.basic(neo4j_username, backend_password));
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
        console.error(colors.red(new Date() + " Neo4j could not been accessed:\n" + JSON.stringify(err)));
    });


// Load certificates
if (environment === "production") {
    var privateKey = fs.readFileSync('ssl/server.key', 'utf8');
    var certificate = fs.readFileSync('ssl/server.crt', 'utf8');

    var credentials = {
        key: privateKey,
        cert: certificate
    };
}


// Server settings
app.use(bodyParser.json({
    limit: 52428800 // 50MB
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: 52428800 // 50MB
}));

// Set folder for static files
app.use(express.static(__dirname + '/public', {
    redirect: false
}));

// Authentication
exports.isAuthenticated = function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.substring(7);

        // Verify token
        jwt.verify(token, jwtSecret, function(err, decoded) {
            if(err){
                res.status(401).send("Authentication failed!");
            } else {
                // Authorization
                if(decoded.username === account.username && decoded.iss === server_url){
                    return next();
                } else {
                    res.status(401).send("Authentication failed!");
                }
            }
        });
    } else {
        res.status(401).send("Authentication failed!");
    }
};

// API endpoint
var prefix = '/api';

// Load API routes
app.use(prefix, require('./routes/reset'));
app.use(prefix, require('./routes/login'));
app.use(prefix, require('./routes/scenarios'));
app.use(prefix, require('./routes/locations'));
app.use(prefix, require('./routes/videos'));
app.use(prefix, require('./routes/overlays'));
app.use(prefix, require('./routes/relationships'));
app.use(prefix, require('./routes/handlers'));

// Resolve path after refreshing inside app
app.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});
app.get('/backend/*', function(req, res, next) {
    res.sendFile(path.resolve('public/backend/index.html'));
});
app.get('/frontend/*', function(req, res, next) {
    res.sendFile(path.resolve('public/frontend/index.html'));
});
app.get('/remote/*', function(req, res, next) {
    res.sendFile(path.resolve('public/remote/index.html'));
});


// Start Webserver
var httpServer = http.createServer(app);
httpServer.listen(httpPort, function() {
    console.log(colors.green(new Date() + " HTTP-Server is listening at port " + httpPort));
});
if(environment === "production") {
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(httpsPort, function() {
        console.log(colors.green(new Date() + " HTTPS-Server is listening at port " + httpsPort));
    });
}


// Start websocket server
var io = require('socket.io')(httpServer);
exports.io = io;
var sockets = require('./controllers/sockets.js').sockets;
console.log(colors.green(new Date() + " Websocket-Server is listening"));
