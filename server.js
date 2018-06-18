var colors = require('colors');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var path = require('path');
var neo4j = require('neo4j-driver').v1;
var jwt = require('jsonwebtoken');
var config = require('dotenv').config();
var multipart = require('connect-multiparty');
var sqlite3 = require('sqlite3').verbose();


// Connect to Neo4j
var driver = neo4j.driver(
    "bolt://" + process.env.NEO4J_HOST + ":" + process.env.NEO4J_PORT,
    neo4j.auth.basic(
        process.env.NEO4J_USERNAME,
        process.env.NEO4J_PASSWORD
));
exports.driver = driver;
var session = driver.session();
var query = "RETURN true;";
session
    .run(query)
    .then(function(result) {
        session.close();
        console.log(colors.green(new Date() + " Neo4j is running on port " + process.env.NEO4J_PORT));
    })
    .catch(function(err) {
        console.error(colors.red(new Date() + " Neo4j could not been accessed:\n" + JSON.stringify(err)));
    });

// Connect to sqlite3 (logger)
var db = new sqlite3.Database('feedback.db');
db.serialize(function() {
    var schemas = [];
    if(JSON.parse(process.env.SQLITE_RESET)){
        // Reset schema
        schemas.push(fs.readFileSync(__dirname + "/sql/schema/reset.sql", 'utf8').toString());
        // Build schema
        schemas.push(fs.readFileSync(__dirname + "/sql/schema/posts.sql", 'utf8').toString());
    }

    async.forEachOf(schemas, function (schema, key, callback) {
        db.run(schema, function(err){
            if(err){
                callback(err);
            } else {
                callback(null);
            }
        });
    }, function (err) {
        if (err) {
            console.error(err.message)
        } else {
            if(JSON.parse(process.env.SQLITE_RESET)){
                console.log(colors.green(new Date() + " Schema has been created"));
            }
        }
    });
});
exports.db = db;

// Load certificates
if (process.env.NODE_ENV === "production") {
    var privateKey = fs.readFileSync('ssl/server.key', 'utf8');
    var certificate = fs.readFileSync('ssl/server.crt', 'utf8');

    var credentials = {
        key: privateKey,
        cert: certificate
    };
}


// Server settings
var app = express();
app.use(bodyParser.json({
    limit: 52428800 // 50MB
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: 52428800 // 50MB
}));

// Set folder for static files
app.use(express.static(__dirname + '/public', {
    redirect: true
}));

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(multipart({
    uploadDir: config.tmp
}));

// Authentication
exports.isAuthenticated = function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.substring(7);

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if(err){
                res.status(401).send("Authentication failed!");
            } else {
                // Authorization
                if(decoded.username === process.env.ADMIN_USERNAME && decoded.iss === process.env.SERVER_URL){
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
app.use(prefix, require('./routes/search'));
app.use(prefix, require('./routes/handlers'));

var cms = require('./routes/cms');
app.use(cms);

// Resolve path after refreshing inside app
app.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});
app.get('/creator/*', function(req, res, next) {
    res.sendFile(path.resolve('public/creator/index.html'));
});
app.get('/viewer/*', function(req, res, next) {
    res.sendFile(path.resolve('public/viewer/index.html'));
});
app.get('/remote/*', function(req, res, next) {
    res.sendFile(path.resolve('public/remote/index.html'));
});


// Start Webserver
var httpServer = http.createServer(app);
httpServer.listen(Number(process.env.HTTP_PORT), function() {
    console.log(colors.green(new Date() + " HTTP-Server is listening at port " + process.env.HTTP_PORT));
});
if(process.env.NODE_ENV === "production") {
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(Number(process.env.HTTPS_PORT), function() {
        console.log(colors.green(new Date() + " HTTPS-Server is listening at port " + process.env.HTTPS_PORT));
    });
}


// Start websocket server
var io = require('socket.io')(httpServer);
exports.io = io;
var sockets = require('./controllers/sockets.js').sockets;
console.log(colors.green(new Date() + " Websocket-Server is listening at port " + process.env.HTTP_PORT));
