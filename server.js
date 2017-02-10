var colors = require('colors');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var path = require('path');
var neo4j = require('neo4j-driver').v1;
var pg = require('pg');

// Create server
var app = express();
var environment = process.env.NODE_ENV || 'development';
var server_url = process.env.SERVER_URL || 'http://giv-sitcomdev.uni-muenster.de';
var httpPort = process.env.HTTP_PORT || 5000;
var httpsPort = process.env.HTTPS_PORT || (httpPort + 443);
var db_host = process.env.DB_HOST || '127.0.0.1';
var db_port = process.env.DB_PORT || '7687';
var db_user = process.env.DB_USER || 'neo4j';
var db_password = process.env.DB_PASSWORD || '123456';
var postgres_host = process.env.POSTGRES_HOST || 'localhost';
var postgres_port = process.env.POSTGRES_PORT || 5432;
var postgres_db_name = process.env.POSTGRES_DB_NAME || 'ive';
var postgres_user = process.env.POSTGRES_USER || 'Nicho';
var postgres_password = process.env.POSTGRES_PASSWORD || undefined;
var postgres_ssl = process.env.POSTGRES_DB_SSL || false;
var backend_user = process.env.BACKEND_USER || 'admin';
var backend_password = process.env.BACKEND_PASSWORD || 'admin';
var jwtSecret = process.env.JWTSECRET || 'superSecretKey';
exports.server_url = server_url;
exports.jwtSecret = jwtSecret;
exports.backend_account = {
    username: backend_user,
    password: backend_password
};
var pool = new pg.Pool({
    user: postgres_user,
    password: postgres_password,
    host: postgres_host,
    port: postgres_port,
    database: postgres_db_name,
    ssl: JSON.parse(postgres_ssl)
});
exports.pool = pool;


// Connect to Neo4j
var driver = neo4j.driver("bolt://" + db_host + ":" + db_port, neo4j.auth.basic(db_user, db_password));
exports.driver = driver;
var session = driver.session();
var query = "RETURN true;";
session
    .run(query)
    .then(function(result) {
        session.close();
        console.log(colors.blue(new Date() + " Neo4j is running on Port " + db_port));
    })
    .catch(function(err) {
        console.error(colors.red(new Date() + " Neo4j could not been accessed:\n" + JSON.stringify(err)));
    });


// Connect to Postgres
pool.connect(function(err, client, done) {
    if(err) {
        console.error(err);
        console.error(colors.red(new Date() + " Postgres is not running!"));
    } else {
        client.query("SELECT true;", function(err, result) {
            done();
            if (err) {
                console.error(colors.red(JSON.stringify(err)));
            } else {
                console.log(colors.blue(new Date() + " Postgres is running on Port " + postgres_port));
            }
        });
    }
});

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});


// Load certificstes
if (environment === "production") {
    var privateKey = fs.readFileSync('ssl/server.key', 'utf8');
    var certificate = fs.readFileSync('ssl/server.crt', 'utf8');

    var credentials = {
        key: privateKey,
        cert: certificate
    };
}

// Setup settings
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


// Load routes for API
var reset = require('./routes/reset');
var login = require('./routes/login');
var scenarios = require('./routes/scenarios');
var locations = require('./routes/locations');
var videos = require('./routes/videos');
var overlays = require('./routes/overlays');
var relationships = require('./routes/relationships');
var handlers = require('./routes/handlers');
app.use('/api', reset);
app.use('/api', login);
app.use('/api', scenarios);
app.use('/api', locations);
app.use('/api', videos);
app.use('/api', overlays);
app.use('/api', relationships);
app.use('/api', handlers);


// Resolve path after refreshing inside app
app.get('/*', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});


// Start Webserver
var httpServer = http.createServer(app);
httpServer.listen(httpPort, function() {
    console.log(colors.blue(new Date() + " HTTP-Server is listening at port " + httpPort));
});
if(environment === "production") {
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(httpsPort, function() {
        console.log(colors.blue(new Date() + " HTTPS-Server is listening at port " + httpsPort));
    });
}

// Start websocket server
var io = require('socket.io')(httpServer);
exports.io = io;
var sockets = require('./controllers/sockets.js').sockets;
console.log(colors.blue(new Date() + " Websocket-Server is listening"));
