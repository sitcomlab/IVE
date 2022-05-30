var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var uuid = require('uuid');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_create_overlay = fs.readFileSync(__dirname + '/../../queries/overlays/create.cypher', 'utf8').toString();


// POST
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback){ // Parameter validation

            // Check overlay_uuid
            var overlay_uuid = uuid.v1();
            if(req.body.overlay_uuid && req.body.overlay_uuid !== ""){
                overlay_uuid = req.body.overlay_uuid;
            }

            // TODO: Validate all attributes of req.body

            var params = {
                overlay_uuid: overlay_uuid,
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                url: req.body.url,
                title: req.body.title ? req.body.title : "",
                distance_meters: (req.body.distance_meters) ? req.body.distance_meters : 0,
                distance_seconds: (req.body.distance_seconds) ? req.body.distance_seconds : 0,
            };

            callback(null, params);
        },
        function(params, callback) { // Create new entry
            session
                .run(query_create_overlay, params)
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
