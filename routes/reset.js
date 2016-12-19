var express = require('express');
var router = express.Router();

var reset = require('../controllers/reset');



// RESET
router.get('/reset', reset.request);

// RESET
router.delete('/reset', reset.request);


module.exports = router;
