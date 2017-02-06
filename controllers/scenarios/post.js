var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../../server.js').jwtSecret;
var backend_account = require('../../server.js').backend_account;
var server_url = require('../../server.js').server_url;
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_create_scenario = fs.readFileSync(__dirname + '/../../queries/scenarios/create.cypher', 'utf8').toString();


// POST
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

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
        function(callback){ // Parameter validation

            // Check s_id
            var s_id = uuid.v1();
            if(req.body.s_id && req.body.s_id !== ""){
                s_id = req.body.s_id;
            }

            // TODO: Validate all attributes of req.body

            var params = {
                s_id: s_id,
                name: req.body.name,
                description: req.body.description
            };

            callback(null, params);
        },
        function(params, callback) { // Create new entry
            session
                .run(query_create_scenario, params)
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
                callback(null, 201, results[0]);
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
