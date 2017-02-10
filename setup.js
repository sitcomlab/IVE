var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var pg = require('pg');
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
var postgres_delimiter = process.env.POSTGRES_DELIMITER || ',';
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
var query = "RETURN true;";
session
    .run(query)
    .then(function(result) {
        session.close();
        console.log(colors.green(new Date() + " Neo4j is running on Port " + db_port));
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
                console.log(colors.green(new Date() + " Postgres is running on Port " + postgres_port));

                // Load files
                var dir_1 = "/queries/setup/neo4j/";
                var dir_2 = "/queries/setup/postgres/";
                var neo4j_queries = [];
                var postgres_queries = [];

                // General
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'reset.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'create_constraint_scenarios.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'create_constraint_locations.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'create_constraint_videos.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'create_constraint_overlays.cypher', 'utf8').toString());

                // Import nodes
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_scenarios.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_locations.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_videos.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_overlays.cypher', 'utf8').toString());

                // Import relationships
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_belongs_to_locations.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_belongs_to_videos.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_belongs_to_overlays.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_has_parent_location.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_connected_to.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_recorded_at.cypher', 'utf8').toString());
                neo4j_queries.push(fs.readFileSync(__dirname + dir_1 + 'import_embedded_in.cypher', 'utf8').toString());

                // General
                postgres_queries.push(fs.readFileSync(__dirname + dir_2 + 'reset.sql', 'utf8').toString());
                postgres_queries.push(fs.readFileSync(__dirname + dir_2 + 'create_categories.sql', 'utf8').toString());
                postgres_queries.push(fs.readFileSync(__dirname + dir_2 + 'create_intents.sql', 'utf8').toString());
                postgres_queries.push(fs.readFileSync(__dirname + dir_2 + 'create_related_intents.sql', 'utf8').toString());

                // Import intents
                var import_intents = fs.readFileSync(__dirname + dir_2 + 'import_intents.sql', 'utf8').toString();
                var import_related_intents = fs.readFileSync(__dirname + dir_2 + 'import_related_intents.sql', 'utf8').toString();
                var import_intents_params = [
                    __dirname + '/data/intents.csv',
                    postgres_delimiter
                ];
                var import_related_intents_params = [
                    __dirname + '/data/related_intents.csv',
                    postgres_delimiter
                ];

                console.log(colors.magenta(import_intents));
                console.log(import_intents_params);
                console.log(colors.magenta(import_related_intents));
                console.log(import_related_intents_params);

                async.series([
                    function(callback){ // Create schemas in Postgres
                        async.forEachOf(postgres_queries, function (postgres_query, key, callback) {
                            // Run query
                            client.query(postgres_query, function(err, result) {
                                done();
                                if (err) {
                                    callback(err);
                                } else {
                                    console.log(colors.blue(postgres_query));
                                    console.log(colors.green("Done!"));
                                    callback();
                                }
                            });
                        }, function(err) {
                            if(err){
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    },
                    function(callback){ // Import intents into Postgres
                        // Run query
                        client.query(import_intents, [], function(err, result) {
                            done();
                            if (err) {
                                callback(err);
                            } else {
                                console.log(colors.blue(import_intents));
                                console.log(colors.green("Done!"));

                                callback(null);
                            }
                        });
                    },
                    function(callback){ // Import related intents into Postgres
                        // Run query
                        client.query(import_related_intents, [], function(err, result) {
                            done();
                            if (err) {
                                callback(err);
                            } else {
                                console.log(colors.blue(import_related_intents));
                                console.log(colors.green("Done!"));

                                callback(null);
                            }
                        });
                    },
                    function(callback){ // Import graph into neo4j
                        async.forEachOf(neo4j_queries, function (neo4j_query, key, callback) {
                            // Run query
                            session
                                .run(neo4j_query)
                                .then(function(result) {
                                    console.log(colors.blue(neo4j_query));
                                    console.log(colors.green("Done!"));
                                })
                                .catch(function(err) {
                                    callback(err);
                                });
                            callback();
                        }, function(err){
                            // Close connection
                            session.close();

                            if(err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                ], function(err){
                    if(err) {
                        console.error(colors.red(JSON.stringify(err)));
                    } else {
                        //console.log(colors.green("Setup successfully done!"));
                    }
                });

            }
        });
    }

    pool.on('error', function (err, client) {
        console.error('idle client error', err.message, err.stack);
    });
});
