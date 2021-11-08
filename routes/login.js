var express = require('express');
var router = express.Router();

var login = require('../controllers/login');
var refreshToken = require('../controllers/refreshToken');


// LOGIN
router.post('/login', login.request);
router.post('/refreshToken', refreshToken.request);


module.exports = router;
