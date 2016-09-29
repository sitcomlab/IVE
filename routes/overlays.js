var express = require('express');
var router = express.Router();

var list = require('../controllers/overlays/list');
//var list_by_scenario = require('../controllers/overlays/list_by_scenario');
//var post = require('../controllers/overlays/post');
var get = require('../controllers/overlays/get');
//var put = require('../controllers/overlays/put');
//var del = require('../controllers/overlays/delete');


// LIST
router.get('/overlays', list.request);

// LIST BY SCENARIO
//router.get('/scenarios/:scenario_id/overlays', list_by_scenario.request);

// POST
//router.post('/overlays', post.request);

// GET
router.get('/overlays/:overlay_id', get.request);

// PUT
//router.put('/overlays/:overlay_id', put.request);

// DELETE
//router.delete('/overlays/:overlay_id', del.request);


module.exports = router;
