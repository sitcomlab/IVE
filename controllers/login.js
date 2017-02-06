var async = require('async');
var colors = require('colors');
var _ = require('underscore');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../server.js').jwtSecret;
var backend_account = require('../server.js').backend_account;
var server_url = require('../server.js').server_url;


// LOGIN
exports.request = function(req, res) {

    // Authentication
    if(backend_account.username === req.body.username && backend_account.password === req.body.password){
        // Create payload
        payload = {
            iss: server_url,
            username: backend_account.username,
            exp: moment().add(1, 'days').valueOf()
        };
        // Create JWT
        var result = {
            username: backend_account.username,
            token: jwt.sign(payload, jwtSecret)
        };
        res.status(200).send(result);
    } else {
        var err = "Wrong username or password!";
        console.error(colors.red(err));
        res.status(301).send(err);
    }
};
