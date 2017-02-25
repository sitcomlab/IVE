var async = require('async');
var colors = require('colors');
var _ = require('underscore');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var jwtSecret = require('../server.js').jwtSecret;
var account = require('../server.js').account;
var server_url = require('../server.js').server_url;


// LOGIN
exports.request = function(req, res) {

    // Authentication
    if(account.username === req.body.username && account.password === req.body.password){
        // Create payload
        payload = {
            iss: server_url,
            username: account.username,
            exp: moment().add(1, 'days').valueOf()
        };
        // Create JWT
        var result = {
            username: account.username,
            token: jwt.sign(payload, jwtSecret)
        };
        res.status(200).send(result);
    } else {
        var err = "Wrong username or password!";
        console.error(colors.red(err));
        res.status(301).send(err);
    }
};
