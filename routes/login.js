var express = require('express');
var router = express.Router();

var login = require('../controllers/login');



// LOGIN
router.post('/login', login.request);


module.exports = router;
