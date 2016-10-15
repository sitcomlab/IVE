var express = require('express');
var router = express.Router();

var list = require('../controllers/videos/list');
var list_by_scenario = require('../controllers/videos/list_by_scenario');
var list_by_location = require('../controllers/videos/list_by_location');
//var post = require('../controllers/videos/post');
var get = require('../controllers/videos/get');
//var put = require('../controllers/videos/put');
//var del = require('../controllers/videos/delete');


// LIST
router.get('/videos', list.request);

// LIST BY SCENARIO
router.get('/scenarios/:scenario_id/videos', list_by_scenario.request);

// LIST BY LOCATION
router.get('/locations/:location_id/videos', list_by_location.request);

// POST
//router.post('/videos', post.request);

// GET
router.get('/videos/:video_id', get.request);

// PUT
//router.put('/videos/:video_id', put.request);

// DELETE
//router.delete('/videos/:video_id', del.request);


module.exports = router;
