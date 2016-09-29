var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;


// GET
exports.request = function(req, res) {

    var session = driver.session();
    var query = "MATCH (s:Scenarios) " +
        "WHERE ID(s)= toInt({scenario_id}) " +
        "RETURN " +
            "ID(s) AS scenario_id, " +
            "s.created AS created, " +
            "s.updated AS updated, " +
            "s.s_id AS s_id, " +
            "s.name AS name, " +
            "s.description AS description;";

    session
        .run(query, {
            scenario_id: req.params.scenario_id
        })
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

                    // Check if Scenario exists
                    if(results.length === 0){
                        console.log(colors.red("Scenario with id '" + req.params.scenario_id + "' not found!"));
                        res.status(404).send("Scenario not found!");
                    } else {
                        // Send Result
                        res.status(200).send(results[0]);
                    }
                }
            });

        })
        .catch(function(err) {
            console.log(colors.red(err));
            res.status(500).send(err);
        });

};
