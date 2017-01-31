var express = require('express');
var router = express.Router();

//var get = require('../controllers/relationships/get');
var list_belongs_to = require('../controllers/relationships/list/belongs_to');
var list_connected_to = require('../controllers/relationships/list/connected_to');
var list_embedded_in = require('../controllers/relationships/list/embedded_in');
var list_parent_location = require('../controllers/relationships/list/parent_location');
var list_recorded_at = require('../controllers/relationships/list/recorded_at');

//var get_belongs_to = require('../controllers/relationships/get/belongs_to');
var get_connected_to = require('../controllers/relationships/get/connected_to');
var get_embedded_in = require('../controllers/relationships/get/embedded_in');
var get_parent_location = require('../controllers/relationships/get/parent_location');
var get_recorded_at = require('../controllers/relationships/get/recorded_at');



// LIST BY RELATIONSHIP-TYPE
router.get('/relationship/belongs_to/:label', list_belongs_to.request);

router.get('/relationship/connected_to', list_connected_to.request);

router.get('/relationship/embedded_in', list_embedded_in.request);

router.get('/relationship/parent_location', list_parent_location.request);

router.get('/relationship/recorded_at', list_recorded_at.request);

// GET
//router.get('/relationships/:relationship_id', get.request);

// GET BY ID
//router.get('/relationship/belongs_to/:relationship_id/:label', get_belongs_to.request);

router.get('/relationship/connected_to/:relationship_id', get_connected_to.request);

router.get('/relationship/embedded_in/:relationship_id', get_embedded_in.request);

router.get('/relationship/parent_location/:relationship_id', get_parent_location.request);

router.get('/relationship/recorded_at/:relationship_id', get_recorded_at.request);


module.exports = router;
