var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../../server.js').driver;
var fs = require("fs");
var query_create_relationship_location = fs.readFileSync(__dirname + '/../../../queries/relationships/create/belongs_to_location.cypher', 'utf8').toString();
var query_create_relationship_video = fs.readFileSync(__dirname + '/../../../queries/relationships/create/belongs_to_video.cypher', 'utf8').toString();
var query_create_relationship_to_overlay = fs.readFileSync(__dirname + '/../../../queries/relationships/create/belongs_to_overlay.cypher', 'utf8').toString();
var query_get_scenario = fs.readFileSync(__dirname + '/../../../queries/scenarios/get.cypher', 'utf8').toString();
var query_get_location = fs.readFileSync(__dirname + '/../../../queries/locations/get.cypher', 'utf8').toString();
var query_get_video = fs.readFileSync(__dirname + '/../../../queries/videos/get.cypher', 'utf8').toString();
var query_get_overlay = fs.readFileSync(__dirname + '/../../../queries/overlays/get.cypher', 'utf8').toString();


// POST (:belongs_to)
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    var query_1;
    var query_2;
    var query_3;
    switch (req.params.label) {
        case 'location': {
            query_1 = query_get_location;
            query_2_params = {
                location_id: req.body.location_id
            };
            query_2 = query_get_scenario;
            query_2_params = {
                scenario_id: req.body.scenario_id
            };

            query_3 = query_create_relationship_location;

            // TODO: Parameter validation
            query_3_params = {
                location_id: req.body.location_id,
                scenario_id: req.body.scenario_id
            };
            break;
        }
        case 'video': {
            query_1 = query_get_video;
            query_1_params = {
                video_id: req.body.video_id
            };
            query_2 = query_get_scenario;
            query_2_params = {
                scenario_id: req.body.scenario_id
            };
            query_3 = query_create_relationship_video;

            // TODO: Parameter validation
            query_3_params = {
                video_id: req.body.video_id,
                scenario_id: req.body.scenario_id
            };
            break;
        }
        case 'overlay': {
            query_1 = query_get_overlay;
            query_1_params = {
                overlay_id: req.body.overlay_id
            };
            query_2 = query_get_scenario;
            query_2_params = {
                scenario_id: req.body.scenario_id
            };
            query_3 = query_create_relationship_overlay;

            // TODO: Parameter validation
            query_3_params = {
                overlay_id: req.body.overlay_id,
                scenario_id: req.body.scenario_id
            };
            break;
        }
        default:
            query = "";
    }

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_1, query_1_params)
                .then(function(result) {
                    // Check if Location / Video / Overlay exists
                    if (result.records.length===0) {
                        var err;
                        if(query_1_params.location_id){
                            err = new Error("Location with id '" + query_1_params.location_id + "' not found!");
                        } else if(query_1_params.video_id){
                            err = new Error("Video with id '" + query_1_params.video_idquery_1_params.video_id + "' not found!");
                        } else if (query_1_params.overlay_id){
                            err = new Error("Overlay with id '" + query_1_params.overlay_id + "' not found!");
                        }
                        callback(err, 404);
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
                .run(query_2, query_2_params)
                .then(function(result) {
                    // Check if Scenario exists
                    if (result.records.length===0) {
                        callback(new Error("Scenario with id '" + req.body.scenario_id + "' not found!"), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback) { // Create new entry
            session
                .run(query_3, query_3_params)
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
