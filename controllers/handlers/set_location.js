var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_location = fs.readFileSync(__dirname + '/../../queries/locations/get.cypher', 'utf8').toString();
var io = require("socket.io-client");


// SET LOCATION
exports.request = function(req, res) {
    console.log(colors.yellow("Set location: " + req.params.location_id));

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry by Id
            session
                .run(query_get_location, {
                    location_id: req.params.location_id
                })
                .then(function(result) {
                    // Check if Location exists
                    if (result.records.length===0) {
                        callback(new Error("Location with id '" + req.params.location_id + "' not found!"), 404);
                    } else {
                        callback(null, result);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Send Websocket-Message
            var client = io.connect("http://localhost:" + process.env.HTTP_PORT);
            client.on('connect',function() {
                client.emit('/set/location', {
                    location_id: req.params.location_id
                });
                client.close();
                callback(null, 204, null);
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
