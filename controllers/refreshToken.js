var colors = require('colors');
const { createToken, useRefreshToken } = require('./jwtHelper');
const { addTokenHashToBlacklist } = require('./jwtTokenBlacklist');
var moment = require('moment');

const refreshJwt = async function refreshJwt (oldRefreshToken) {
  return new Promise(async function (resolve, reject) { // TODO: doesnt need to be promise anymore
    if(useRefreshToken(oldRefreshToken)) {
      // invalidate old token
      addTokenHashToBlacklist(oldRefreshToken);

      payload = {
        iss: process.env.SERVER_URL,
        sub: 'Login by username and password',
        username: process.env.ADMIN_USERNAME,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
      };
    
      const { token, refreshToken: newRefreshToken } = await createToken(payload);

    
      resolve({ token, refreshToken: newRefreshToken });
    } else {
      var err = "Refresh token not found or expired. Please sign in with your username and password.";
      reject(err);
    }
  })
  
};

  // LOGIN
exports.request = async function(req, res) {
  refreshJwt(req.body.refresh)
  .then(({ token, refreshToken }) => {
    // Create JWT
    var result = {
      username: process.env.ADMIN_USERNAME,
      token: token,
      refreshToken: refreshToken
    };
    res.status(200).send(result);
  }, (err) => {
    console.error(colors.red(err));
    res.status(301).send(err); // TODO: also catch 500 and so on
  });
};