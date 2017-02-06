var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var fs = require('fs');

var db_host = process.env.DB_HOST || '127.0.0.1';
var db_port = process.env.DB_PORT || '7687';
var db_user = process.env.DB_USER || 'neo4j';
var db_password = process.env.DB_PASSWORD || '123456';

// Connect to Neo4j
var driver = neo4j.driver("bolt://" + db_host + ":" + db_port, neo4j.auth.basic(db_user, db_password));
var session = driver.session();

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
queries.push(fs.readFileSync(__dirname + dir + 'import_parent_location.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_connected_to.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_recorded_at.cypher', 'utf8').toString());
queries.push(fs.readFileSync(__dirname + dir + 'import_embedded_in.cypher', 'utf8').toString());


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

    if(err) {
        console.error(colors.red(JSON.stringify(err)));
    } else {
        console.log(colors.green("Setup successfully done!"));
    }
});
