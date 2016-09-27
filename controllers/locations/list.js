var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;


// LIST
exports.request = function(req, res) {

    var session = driver.session();
    var query = "MATCH (l:Locations) " +
        "RETURN " +
            "ID(l) AS location_id, " +
            "l.created AS created, " +
            "l.updated AS updated, " +
            "l.l_id AS l_id, " +
            "l.name AS name, " +
            "l.description AS description, " +
            "l.lat AS lat, " +
            "l.lon AS lon, " +
            "l.indoor AS indoor " +
        "ORDER BY l.name DESC;";

        session
            .run(query)
            .then(function(result) {
                session.close();
                var results = [];

                async.forEachOf(result.records, function (record, item, callback) {
                    var object = {};

                    async.forEachOf(record.keys, function (key, item, callback) {

                        if(typeof(record._fields[item]) === 'object'){
                            if(key === 'id') {
                               object[key] = Number(record._fields[item].low);
                            } else if (record._fields[item] === null){
                                object[key] = record._fields[item];
                            } else {
                               object[key] = Number(record._fields[item]);
                            }
                        } else {
                            object[key] = record._fields[item];
                        }
                        callback();
                    }, function(){
                        results.push(object);
                        callback();
                    });

                }, function (err) {
                    if (err) {
                        console.log(colors.red(err));
                        res.status(500).send(err);
                    } else {
                        // Send Result
                        res.status(200).send(results);
                    }
                });

            })
            .catch(function(err) {
                console.log(colors.red(err));
                res.status(500).send(err);
            });

};
