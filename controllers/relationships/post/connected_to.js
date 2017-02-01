var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../../server.js').driver;
var fs = require("fs");
var query_create_relationship = fs.readFileSync(__dirname + '/../../../queries/relationships/create/connected_to.cypher', 'utf8').toString();
var query_get_location = fs.readFileSync(__dirname + '/../../../queries/locations/get.cypher', 'utf8').toString();


// POST (:connected_to)
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_get_location, {
                    location_id: req.body.start_location_id
                })
                .then(function(result) {
                    // Check if Location exists
                    if (result.records.length===0) {
                        callback(new Error("Location with id '" + req.body.start_location_id + "' not found!"), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback) { // Find entry by Id
            session
                .run(query_get_location, {
                    location_id: req.body.end_location_id
                })
                .then(function(result) {
                    // Check if Location exists
                    if (result.records.length===0) {
                        callback(new Error("Location with id '" + req.body.end_location_id + "' not found!"), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback){ // Parameter validation

            // TODO: Validate all attributes of req.body
            var params = {
                start_location_id: req.body.start_location_id,
                end_location_id: req.body.end_location_id,
                weight: req.body.weight
            };

            callback(null, params);
        },
        function(params, callback) { // Create new entry
            session
                .run(query_create_relationship, params)
                .then(function(result) {
                    callback(null, result);
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Format attributes
            var results = [];

            async.eachOf(result.records, function(record, item, callback) {
                var object = {};

                async.eachOf(record.keys, function(key, item, callback) {

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
                // Check if relationship exists
                if(results.length===0){
                    callback(new Error("Relationship not found"), 404);
                } else {
                    callback(null, 201, results[0]);
                }
            });
        }
    ], function(err, code, result){
        // Close session
        session.close();

        // Send response
        if(err){
            if(!err.message){
                err.message = JSON.stringify(err);
            }
            console.error(colors.red(err.message));
            res.status(code).send(err.message);
        } else {
            res.status(code).send(result);
        }
    });

};
