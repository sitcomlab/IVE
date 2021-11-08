const crypto = require('crypto');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var { v4: uuidv4 } = require('uuid');

var refreshTokens = Object.create(null);

const jwtSignOptions = {
  algorithm: "HS384"
};

const hashJWT = function hashJWT (jwtString) {
  if (typeof jwtString !== 'string') {
    throw new Error('method hashJWT expects a string parameter');
  }

  return crypto
    .createHmac('sha256', 'I ALSO WANT TO BE CHANGED')
    .update(jwtString)
    .digest('base64');
};


const createToken = function createToken (payload) {
  payload.jwtid = uuidv4();
    return new Promise(function (resolve, reject) {
      jwt.sign(payload, process.env.JWT_SECRET, async (err, token) => {
        if (err) {
            return reject(err);
        }

        try {
            // JWT generation was successful
            // we now create the refreshToken.
            // and set the refreshTokenExpires to 1 week
            // it is a HMAC of the jwt string
            const refreshToken = hashJWT(token);
            addRefreshToken(refreshToken);

            return resolve({ token, refreshToken });
        } catch (err) {
            return reject(err);
        }
      });
    });
  };

const useRefreshToken = function useRefreshToken (refreshToken) {
    const now = Date.now() / 1000;
    if (typeof refreshTokens[refreshToken] !== 'undefined' && refreshTokens[refreshToken].exp > now) {
        refreshTokens[refreshToken] = undefined;
        return true;
    }
    return false;
}

const addRefreshToken = function addRefreshToken (refreshToken) {
    refreshTokens[refreshToken] = {
        exp: moment().add(7, 'days').unix()
    };
}

  module.exports = { createToken, hashJWT, useRefreshToken, addRefreshToken };