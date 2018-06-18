var colors = require('colors');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var db = require('../../server.js').db;
var fs = require("fs");


// GET RATING BY VIDEO
exports.request = function(req, res) {

    async.waterfall([
        function(callback) {
            var query = fs.readFileSync(__dirname + "/../../sql/queries/posts/get_rating_by_video.sql", 'utf8').toString();

            db.all(query, {
                $video_id: req.params.video_id
            }, function(err, rows){
                if(err) {
                    callback(err, 500);
                } else {
                    // Check if entry exists
                    if(rows.length > 0){
                        callback(null, 200, rows[0]);
                    } else {
                        callback(new Error("Rating not found"), 404);
                    }
                }
            });
        }
    ], function(err, code, result){
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
