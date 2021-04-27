var express = require('express');
var router = express.Router();
var isAuthenticated = require('../server.js').isAuthenticated;

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var list = require('../controllers/overlays/list');
var post = require('../controllers/overlays/post');
var del_all = require('../controllers/overlays/delete_all');

var get = require('../controllers/overlays/get');
var put = require('../controllers/overlays/put');
var del = require('../controllers/overlays/delete');

var list_by_scenario = require('../controllers/overlays/list_by_scenario');
var list_by_video = require('../controllers/overlays/list_by_video');

const { storeFileMiddleware } = require('../controllers/storage');

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

// UPLOAD IMAGE
router.post('/overlays/uploadImage',
  multipartMiddleware,
  isAuthenticated,
  storeFileMiddleware('images', true),
);

// UPLOAD VIDEO
router.post('/overlays/uploadVideo',
  multipartMiddleware,
  isAuthenticated,
  storeFileMiddleware('video_overlays', true),
);

// UPLOAD OBJECT
router.post('/overlays/uploadObject',
  multipartMiddleware,
  isAuthenticated,
  storeFileMiddleware('objects', true),
);

module.exports = router;
