var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query = fs.readFileSync(__dirname + '/../../queries/locations/list.cypher', 'utf8').toString();


// LIST
exports.request = function(req, res) {

    var session = driver.session();
    session
        .run(query)
        .then(function(result) {
            session.close();
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

            }, function(err) {
                if (err) {
                    console.error(colors.red(JSON.stringify(err)));
                    res.status(500).send(err);
                } else {
                    // Send Result
                    res.status(200).send(results);
                }
            });

        })
        .catch(function(err) {
            console.error(colors.red(JSON.stringify(err)));
            res.status(500).send(err);
        });

};
