var express = require('express');
var router = express.Router();

var list = require('../controllers/locations/list');
//var list_by_scenario = require('../controllers/locations/list_by_scenario');
//var post = require('../controllers/locations/post');
var get = require('../controllers/locations/get');
var put = require('../controllers/locations/put');
//var del = require('../controllers/locations/delete');


// LIST
router.get('/locations', list.request);

// LIST BY SCENARIO
//router.get('/scenarios/:scenario_id/locations', list_by_scenario.request);

// POST
//router.post('/locations', post.request);

// GET
router.get('/locations/:location_id', get.request);

// PUT
//router.put('/locations/:location_id', put.request);

// DELETE
//router.delete('/locations/:location_id', del.request);


module.exports = router;
