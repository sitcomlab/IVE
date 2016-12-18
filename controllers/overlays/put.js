var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var uuid = require('uuid');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_overlay = fs.readFileSync(__dirname + '/../../queries/overlays/get.cypher', 'utf8').toString();
var query_edit_overlay = fs.readFileSync(__dirname + '/../../queries/overlays/edit.cypher', 'utf8').toString();


// PUT
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback){ // Find entry
            session
                .run(query_get_overlay, {
                    overlay_id: req.params.overlay_id
                })
                .then(function(result) {
                    // Check if Overlay exists
                    if (result.records.length === 0) {
                        callback(new Error({
                            message: "Overlay with id '" + req.params.overlay_id + "' not found!"
                        }), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback){ // Parameter validation

            // Check o_id
            var o_id = uuid.v1();
            if(req.body.o_id && req.body.o_id !== ""){
                o_id = req.body.o_id;
            }

            // TODO: Validate all attributes of req.body

            var params = {
                overlay_id: req.params.overlay_id,
                o_id: o_id,
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                url: req.body.url
            };

            callback(null, params);
        },
        function(params, callback) { // Edit entry
            session
                .run(query_edit_overlay, params)
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
            console.error(colors.red(JSON.stringify(err)));
            res.status(code).send(err);
        } else {
            res.status(code).send(result);
        }
    });

};
