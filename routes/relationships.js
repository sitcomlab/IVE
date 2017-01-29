var express = require('express');
var router = express.Router();

var get = require('../controllers/relationships/get');
var belongs_to = require('../controllers/relationships/belongs_to');
var connected_to = require('../controllers/relationships/connected_to');
var embedded_in = require('../controllers/relationships/embedded_in');
var parent_location = require('../controllers/relationships/parent_location');
var recorded_at = require('../controllers/relationships/recorded_at');



// LIST BY RELATIONSHIP-TYPE
router.get('/relationship/belongs_to/:label', belongs_to.request);

router.get('/relationship/connected_to', connected_to.request);

router.get('/relationship/embedded_in', embedded_in.request);

router.get('/relationship/parent_location', parent_location.request);

router.get('/relationship/recorded_at', recorded_at.request);

// GET BY ID
router.get('/relationships/:relationship_id', get.request);


module.exports = router;
