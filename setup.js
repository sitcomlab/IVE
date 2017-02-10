var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var fs = require('fs');

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
var session = driver.session();

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

// Load files
var dir = "/queries/setup/";
var queries = [];

// General
queries.push(fs.readFileSync(__dirname + dir + 'reset.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'create_constraint_scenarios.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'create_constraint_locations.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'create_constraint_videos.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'create_constraint_overlays.cypher', 'utf8').toString());

// Import nodes
queries.push(fs.readFileSync(__dirname + dir + 'import_scenarios.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_locations.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_videos.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_overlays.cypher', 'utf8').toString());

// Import relationships
queries.push(fs.readFileSync(__dirname + dir + 'import_belongs_to_locations.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_belongs_to_videos.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_belongs_to_overlays.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_has_parent_location.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_connected_to.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_recorded_at.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_embedded_in.cypher', 'utf8').toString());

async.waterfall([
    function(callback){ // Import graph in neo4j
        async.forEachOf(queries, function (query, key, callback) {
            // Run query
            session
                .run(query)
                .then(function(result) {
                    console.log(colors.blue(query));
                    console.log(colors.green("Done!"));
                    callback(null);
                })
                .catch(function(err) {
                    callback(err);
                });
        }, function(err){
            // Close connection
            session.close();
            callback();
            if(err) {
                callback(err);

            } else {
                callback(null);
            }
        });
    },
    function(callback){ // Import intents in Postgres
        var query = "COPY Intents FROM '" + __dirname + inputFile + "' WITH DELIMITER ','" + headers +  ";";

        // Database query
        client.query(query, function(err, result) {
            done();
            if (err) {
                callback(err);
            } else {
                console.log(colors.blue(query));
                console.log(colors.green("Done!"));

                callback(null);
            }
        });
    }
], function(err){
    if(err) {
        console.error(colors.red(JSON.stringify(err)));
    } else {
        console.log(colors.green("Setup successfully done!"));
    }
});
