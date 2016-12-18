var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_delete_all_overlays = fs.readFileSync(__dirname + '/../../queries/overlays/delete_all.cypher', 'utf8').toString();


// DELETE ALL
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback){ // Delete all entries
            session
                .run(query_delete_all_overlays)
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
