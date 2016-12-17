var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var uuid = require('uuid');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_create_video = fs.readFileSync(__dirname + '/../../queries/videos/create.cypher', 'utf8').toString();


// POST
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback){ // Parameter validation

            // Check v_id
            var v_id = uuid.v1();
            if(req.body.v_id && req.body.v_id !== ""){
                v_id = req.body.v_id;
            }

            // TODO: Validate all attributes of req.body

            var params = {
                v_id: v_id,
                name: req.body.name,
                description: req.body.description,
                url: req.body.url,
                recorded: req.body.recorded
            };

            callback(null, params);
        },
        function(params, callback) { // Create new entry
            session
                .run(query_create_video, params)
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
            console.error(colors.red(err));
            res.status(code).send(err.message);
        } else {
            res.status(code).send(result);
        }
    });

};