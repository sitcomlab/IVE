var express = require('express');
var router = express.Router();
var isAuthenticated = require('../server.js').isAuthenticated;

var reset = require('../controllers/reset');



// RESET
router.get('/reset', isAuthenticated, reset.request);

// RESET
router.delete('/reset', isAuthenticated, reset.request);


module.exports = router;
