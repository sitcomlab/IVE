var colors = require('colors');
var moment = require('moment');
var jwt = require('jsonwebtoken');


// LOGIN
exports.request = function(req, res) {

    // Authentication
    if(process.env.ADMIN_USERNAME === req.body.username && process.env.ADMIN_PASSWORD === req.body.password){
        // Create payload
        payload = {
            iss: process.env.SERVER_URL,
            sub: 'Login by username and password',
            username: process.env.ADMIN_USERNAME,
            iat: moment().unix(),
            exp: moment().add(1, 'days').unix()
        };
        // Create JWT
        var result = {
            username: process.env.ADMIN_USERNAME,
            token: jwt.sign(payload, process.env.JWT_SECRET)
        };
        res.status(200).send(result);
    } else {
        var err = "Wrong username or password!";
        console.error(colors.red(err));
        res.status(301).send(err);
    }
};
