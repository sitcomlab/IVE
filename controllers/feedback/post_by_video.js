var colors = require('colors');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var uuid = require('uuid');
var db = require('../../server.js').db;
var fs = require("fs");


// POST
exports.request = function(req, res) {

    // Create UUID
    var post_uuid = uuid.v4();

    async.waterfall([
        function(callback) {
            var query = fs.readFileSync(__dirname + '/../../sql/queries/posts/create.sql', 'utf8').toString();

            db.all(query, {
                $post_uuid: post_uuid,
                $comment: req.body.comment,
                $rating: req.body.rating,
                $video_id: req.params.video_id
            }, function(err, rows){
                if(err) {
                    callback(err, 500);
                } else {
                    callback(null, post_uuid);
                }
            });
        },
        function(post_uuid, callback) {
            var query = fs.readFileSync(__dirname + "/../../sql/queries/posts/get_by_uuid.sql", 'utf8').toString();

            db.all(query, {
                $post_uuid: post_uuid,
            }, function(err, rows){
                if(err) {
                    callback(err, 500);
                } else {
                    // Check if entry exists
                    if(rows.length > 0){
                        callback(null, 201, rows[0]);
                    } else {
                        callback(new Error("Post not found"), 404);
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
