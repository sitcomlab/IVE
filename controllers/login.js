var colors = require('colors');
var moment = require('moment');
const { createToken } = require('./jwtHelper');


// LOGIN
exports.request = async function(req, res) {

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
        const { token, refreshToken } = await createToken(payload);

        // Create JWT
        var result = {
            username: process.env.ADMIN_USERNAME,
            token: token,
            refreshToken: refreshToken
        };
        res.status(200).send(result);
    } else {
        var err = "Wrong username or password!";
        console.error(colors.red(err));
        res.status(301).send(err);
    }
};
