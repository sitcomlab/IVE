var express = require('express');
var router = express.Router();
var isAuthenticated = require('../server.js').isAuthenticated;

var list = require('../controllers/scenarios/list');
var post = require('../controllers/scenarios/post');
var del_all = require('../controllers/scenarios/delete_all');

var get = require('../controllers/scenarios/get');
var put = require('../controllers/scenarios/put');
var del = require('../controllers/scenarios/delete');



// LIST
router.get('/scenarios', list.request);

// POST
router.post('/scenarios', isAuthenticated, post.request);

// DELETE ALL
router.delete('/scenarios', isAuthenticated, del_all.request);


// GET
router.get('/scenarios/:scenario_id', get.request);

// PUT
router.put('/scenarios/:scenario_id', isAuthenticated, put.request);

// DELETE
router.delete('/scenarios/:scenario_id', isAuthenticated, del.request);


module.exports = router;
