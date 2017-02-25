var express = require('express');
var router = express.Router();
var isAuthenticated = require('../server.js').isAuthenticated;

var list = require('../controllers/overlays/list');
var post = require('../controllers/overlays/post');
var del_all = require('../controllers/overlays/delete_all');

var get = require('../controllers/overlays/get');
var put = require('../controllers/overlays/put');
var del = require('../controllers/overlays/delete');

var list_by_scenario = require('../controllers/overlays/list_by_scenario');
var list_by_video = require('../controllers/overlays/list_by_video');



// LIST
router.get('/overlays', list.request);

// POST
router.post('/overlays', isAuthenticated, post.request);

// DELETE ALL
router.delete('/overlays', isAuthenticated, del_all.request);


// GET
router.get('/overlays/:overlay_id', get.request);

// PUT
router.put('/overlays/:overlay_id', isAuthenticated, put.request);

// DELETE
router.delete('/overlays/:overlay_id', isAuthenticated, del.request);


// LIST BY SCENARIO
router.get('/scenarios/:scenario_id/overlays', list_by_scenario.request);


// LIST BY VIDEO
router.get('/videos/:video_id/overlays', list_by_video.request);


module.exports = router;
