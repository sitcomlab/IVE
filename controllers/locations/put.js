var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var uuid = require('uuid');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_location = fs.readFileSync(__dirname + '/../../queries/locations/get.cypher', 'utf8').toString();
var query_edit_location = fs.readFileSync(__dirname + '/../../queries/locations/edit.cypher', 'utf8').toString();


// PUT
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback){ // Find entry
            session
                .run(query_get_location, {
                    location_id: req.params.location_id
                })
                .then(function(result) {
                    // Check if Location exists
                    if (result.records.length===0) {
                        callback(new Error("Location with id '" + req.params.location_id + "' not found!"), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback){ // Parameter validation

            // Check location_uuid
            var location_uuid = uuid.v1();
            if(req.body.location_uuid && req.body.location_uuid !== ""){
                location_uuid = req.body.location_uuid;
            }

            // TODO: Validate all attributes of req.body

            var params = {
                location_id: req.params.location_id,
                location_uuid: location_uuid,
                name: req.body.name,
                description: req.body.description,
                length: (req.body.length) ? req.body.length : 0,
                lat: req.body.lat,
                lng: req.body.lng,
                location_type: req.body.location_type
            };

            callback(null, params);
        },
        function(params, callback) { // Edit entry
            session
                .run(query_edit_location, params)
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
