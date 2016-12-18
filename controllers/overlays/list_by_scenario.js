var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_scenario = fs.readFileSync(__dirname + '/../../queries/scenarios/get.cypher', 'utf8').toString();
var query_list_overlays_by_scenario = fs.readFileSync(__dirname + '/../../queries/overlays/list_by_scenario.cypher', 'utf8').toString();


// LIST BY SCENARIO
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_get_scenario, {
                    scenario_id: req.params.scenario_id
                })
                .then(function(result) {
                    // Check if Scenario exists
                    if (result.records.length === 0) {
                        callback(new Error({
                            message: "Scenario with id '" + req.params.scenario_id + "' not found!"
                        }), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback) { // Find entries
            session
                .run(query_list_overlays_by_scenario, {
                    scenario_id: req.params.scenario_id
                })
                .then(function(result) {
                    callback(null, result);
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Format attributes
            var results = [];

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
                callback(null, 200, results);
            });
        }
    ], function(err, code, result){
        // Close session
        session.close();

        // Send response
        if(err){
            console.error(colors.red(JSON.stringify(err)));
            res.status(code).send(err);
        } else {
            res.status(code).send(result);
        }
    });

};
