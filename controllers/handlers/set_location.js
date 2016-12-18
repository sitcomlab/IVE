var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_location = fs.readFileSync(__dirname + '/../../queries/locations/get.cypher', 'utf8').toString();
var io = require("socket.io-client");
var httpPort = require('../../server.js').httpPort;


// SET LOCATION
exports.request = function(req, res) {
    console.log(colors.yellow("Set location: " + req.params.location_id));

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_get_location, {
                    location_id: req.params.location_id
                })
                .then(function(result) {
                    // Check if Location exists
                    if (result.records.length === 0) {
                        callback(new Error("Location with id '" + req.params.location_id + "' not found!"), 404);
                    } else {
                        callback(null, result);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Format attributes
            /*var results = [];

            async.forEachOf(result.records, function(record, item, callback) {
                var object = {};

                async.forEachOf(record.keys, function(key, item, callback) {

                    if (typeof(record._fields[item]) === 'object') {
                        if (key === 'id') {
                            object[key] = Number(record._fields[item].low);
                        } else if (record._fields[item] === null) {
                            object[key] = record._fields[item];
                        } else {
                            object[key] = Number(record._fields[item]);
                        }
                    } else {
                        object[key] = record._fields[item];
                    }
                    callback();
                }, function() {
                    results.push(object);
                    callback();
                });

            }, function() {
                // Send Websocket-Message
                var client = io.connect("http://localhost:" + httpPort);
                client.on('connect',function() {
                    client.emit('/set/location', results[0]);
                    client.emit('/set/location', {
                        location_id: req.params.location_id
                    });
                    client.close();
                    callback(null, 204, null);
                });
            });*/

            // Send Websocket-Message
            var client = io.connect("http://localhost:" + httpPort);
            client.on('connect',function() {
                client.emit('/set/location', {
                    location_id: req.params.location_id
                });
                client.close();
                callback(null, 204, null);
            });
        }
    ], function(err, code, result){
        // Close session
        session.close();

        // Send response
        if(err){
            console.error(colors.red(JSON.stringify(err)));
            res.status(code).send(err.message);
        } else {
            res.status(code).send(result);
        }
    });

};
