var express = require('express');
var router = express.Router();

var list = require('../controllers/scenarios/list');
//var post = require('../controllers/scenarios/post');
var get = require('../controllers/scenarios/get');
//put = require('../controllers/scenarios/put');
//var del = require('../controllers/scenarios/delete');


// LIST
router.get('/scenarios', list.request);

// POST
//router.post('/scenarios', post.request);

// GET
router.get('/scenarios/:scenario_id', get.request);

// PUT
//router.put('/scenarios/:scenario_id', put.request);

// DELETE
//router.delete('/scenarios/:scenario_id', del.request);


module.exports = router;
