var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../../server.js').driver;
var fs = require("fs");
var query_create_relationship = fs.readFileSync(__dirname + '/../../../queries/relationships/create/embedded_in.cypher', 'utf8').toString();
var query_get_overlay= fs.readFileSync(__dirname + '/../../../queries/overlays/get.cypher', 'utf8').toString();
var query_get_video = fs.readFileSync(__dirname + '/../../../queries/videos/get.cypher', 'utf8').toString();


// POST (:embedded_in)
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_get_overlay, {
                    overlay_id: req.body.overlay_id
                })
                .then(function(result) {
                    // Check if Overlay exists
                    if (result.records.length===0) {
                        callback(new Error("Overlay with id '" + req.body.overlay_id + "' not found!"), 404);
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
                .run(query_get_video, {
                    video_id: req.body.video_id
                })
                .then(function(result) {
                    // Check if Video exists
                    if (result.records.length===0) {
                        callback(new Error("Video with id '" + req.body.video_id + "' not found!"), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback){ // Parameter validation

            var params = {
                overlay_id: req.body.overlay_id,
                video_id: req.body.video_id,
                description: req.body.description,
                w: req.body.w,
                h: req.body.h,
                d: req.body.d,
                x: req.body.x,
                y: req.body.y,
                z: req.body.z,
                rx: req.body.rx,
                ry: req.body.ry,
                rz: req.body.rz,
                display: req.body.display
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
