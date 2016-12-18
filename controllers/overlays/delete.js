var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_overlay = fs.readFileSync(__dirname + '/../../queries/overlays/get.cypher', 'utf8').toString();
var query_delete_overlay = fs.readFileSync(__dirname + '/../../queries/overlays/delete.cypher', 'utf8').toString();


// DELETE
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_get_overlay, {
                    overlay_id: req.params.overlay_id
                })
                .then(function(result) {
                    // Check if Overlay exists
                    if (result.records.length === 0) {
                        callback(new Error("Overlay with id '" + req.params.overlay_id + "' not found!"), 404);
                    } else {
                        callback(null, result);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Delete entry
            session
                .run(query_delete_overlay, {
                    overlay_id: req.params.overlay_id
                })
                .then(function(result) {
                    callback(null, 204, null);
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        }
    ], function(err, code, result){
        // Close session
        session.close();

        // Send response
        if(err){
            console.error(colors.red(JSON.stringify(err)));
            res.status(code).send(err.message);
        } else {
            res.status(code).send(result);
        }
    });
};
