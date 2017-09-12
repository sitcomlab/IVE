var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_belongs_to_location = fs.readFileSync(__dirname + '/../../queries/relationships/list/list_belongs_to_location.cypher', 'utf8').toString();
var query_belongs_to_video = fs.readFileSync(__dirname + '/../../queries/relationships/list/list_belongs_to_video.cypher', 'utf8').toString();
var query_belongs_to_overlay = fs.readFileSync(__dirname + '/../../queries/relationships/list/list_belongs_to_overlay.cypher', 'utf8').toString();
var query_connected_to = fs.readFileSync(__dirname + '/../../queries/relationships/list/list_connected_to.cypher', 'utf8').toString();
var query_has_parent_location = fs.readFileSync(__dirname + '/../../queries/relationships/list/list_has_parent_location.cypher', 'utf8').toString();
var query_recorded_at = fs.readFileSync(__dirname + '/../../queries/relationships/list/list_recorded_at.cypher', 'utf8').toString();
var query_embedded_in = fs.readFileSync(__dirname + '/../../queries/relationships/list/list_embedded_in.cypher', 'utf8').toString();


// LIST BY REALTIONSHIP-LABEL
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    var query;
    var orderby = 'name.asc';
    switch (req.params.relationship_label) {
        case 'belongs_to': {
            switch (req.query.relationship_type) {
                case 'location': {
                    query = query_belongs_to_location;
                    break;
                }
                case 'video': {
                    query = query_belongs_to_video;
                    break;
                }
                case 'overlay': {
                    query = query_belongs_to_overlay;
                    break;
                }
                default: {
                    console.log("No relationship_type defined");
                }
            }
            orderby = req.query.orderby || 'scenario_name.asc';
            break;
        }
        case 'connected_to': {
            query = query_connected_to;
            break;
        }
        case 'has_parent_location': {
            query = query_has_parent_location;
            break;
        }
        case 'recorded_at': {
            query = query_recorded_at;
            break;
        }
        case 'embedded_in': {
            query = query_embedded_in;
            break;
        }
    }

    async.waterfall([
        function(callback) { // Find entries
            session
                .run(query, {
                    skip: req.query.skip || 0,
                    limit: req.query.limit || 9999999999,
                    orderby: orderby
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
