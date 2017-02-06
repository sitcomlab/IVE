var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../../../server.js').jwtSecret;
var backend_account = require('../../../server.js').backend_account;
var server_url = require('../../../server.js').server_url;
var driver = require('../../../server.js').driver;
var fs = require("fs");
var query_get_relationship_locatio = fs.readFileSync(__dirname + '/../../../queries/relationships/get.cypher', 'utf8').toString();
var query_edit_relationship_location = fs.readFileSync(__dirname + '/../../../queries/relationships/edit/belongs_to_location.cypher', 'utf8').toString();
var query_edit_relationship_video = fs.readFileSync(__dirname + '/../../../queries/relationships/edit/belongs_to_location.cypher', 'utf8').toString();
var query_edit_relationship_overlay = fs.readFileSync(__dirname + '/../../../queries/relationships/edit/belongs_to_location.cypher', 'utf8').toString();


// PUT (:connected_to)
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    var query;
    switch (req.params.label) {
        case 'location': {
            query = query_edit_relationship_location;
            break;
        }
        case 'video': {
            query = query_edit_relationship_video;
            break;
        }
        case 'overlay': {
            query = query_edit_relationship_overlay;
            break;
        }
        default:
            query = "";
    }

    async.waterfall([
        function(callback) { // Authentication
            if(req.headers.authorization){
                var token = req.headers.authorization.substring(7);

                // Verify token
                jwt.verify(token, jwtSecret, function(err, decoded) {
                    if(err){
                        callback(err, 401);
                    } else {
                        // Authorization
                        if(decoded.username === backend_account.username && decoded.iss === server_url){
                            callback(null);
                        } else {
                            callback(new Error("Authentication failed!"), 401);
                        }
                    }
                });
            } else {
                callback(new Error("Authentication failed!"), 401);
            }
        },
        function(callback) { // Find entry
            session
                .run(query_get_relationship, {
                    relationship_id: req.params.relationship_id
                })
                .then(function(result) {
                    // Check if Relationship exists
                    if (result.records.length===0) {
                        callback(new Error("Relationship with id '" + req.params.relationship_id + "' not found!"), 404);
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
                relationship_id: req.params.relationship_id
            };

            callback(null, params);
        },
        function(params, callback) { // Update entry
            session
                .run(query, params)
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
                callback(null, 200, results[0]);
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
