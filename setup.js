var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var fs = require('fs');
var config = require('dotenv').config();


// Connect to Neo4j
var driver = neo4j.driver(
    "bolt://" + process.env.NEO4J_HOST + ":" + process.env.NEO4J_PORT,
    neo4j.auth.basic(
        process.env.NEO4J_USERNAME,
        process.env.NEO4J_PASSWORD
    )
);
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
queries.push(fs.readFileSync(__dirname + dir + 'import_has_parent_location.cypher', 'utf8').toString());
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
        process.exit();
    }
});
