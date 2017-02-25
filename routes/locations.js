var express = require('express');
var router = express.Router();
var isAuthenticated = require('../server.js').isAuthenticated;

var list = require('../controllers/locations/list');
var post = require('../controllers/locations/post');
var del_all = require('../controllers/locations/delete_all');

var get = require('../controllers/locations/get');
var put = require('../controllers/locations/put');
var del = require('../controllers/locations/delete');

var list_by_scenario = require('../controllers/locations/list_by_scenario');
var list_by_location = require('../controllers/locations/list_by_location');



// LIST
router.get('/locations', list.request);

// POST
router.post('/locations', isAuthenticated, post.request);

// DELETE ALL
router.delete('/locations', isAuthenticated, del_all.request);


// GET
router.get('/locations/:location_id', get.request);

// PUT
router.put('/locations/:location_id', isAuthenticated, put.request);

// DELETE
router.delete('/locations/:location_id', isAuthenticated, del.request);


// LIST BY LOCATION
router.get('/locations/:location_id/locations', list_by_location.request);


// LIST BY SCENARIO
router.get('/scenarios/:scenario_id/locations', list_by_scenario.request);


module.exports = router;
