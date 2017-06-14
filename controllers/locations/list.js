var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_list_locations = fs.readFileSync(__dirname + '/../../queries/locations/list.cypher', 'utf8').toString();
var query_list_locations_filtered_by_location_type = fs.readFileSync(__dirname + '/../../queries/locations/list_filtered_by_location_type.cypher', 'utf8').toString();


// LIST
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback){ // Prepare query and parameters
            var query = query_list_locations;
            var params = {
                skip: req.query.skip || 0,
                limit: req.query.limit || 9999999999,
                orderby: req.query.orderby || 'name.asc'
            }

            // Check for filter
            if(req.query.location_type){
                query = query_list_locations_filtered_by_location_type;
                params.location_type = req.query.location_type;
            }

            callback(null, query, params);
        },
        function(query, params, callback) { // Find entries
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
