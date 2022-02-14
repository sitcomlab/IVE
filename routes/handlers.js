var express = require('express');
var router = express.Router();

var set_scenario = require('../controllers/handlers/set_scenario');
var set_location = require('../controllers/handlers/set_location');
var set_video = require('../controllers/handlers/set_video');


// SET SCENARIO
router.get('/handlers/set/scenario/:scenario_id/:scenario_name', set_scenario.request);

// SET LOCATION
router.get('/handlers/set/location/:location_id/:location_type/:location_name', set_location.request);
router.get('/handlers/set/location/:location_id/:location_type/:location_name/:length', set_location.request);

// SET VIDEO
router.get('/handlers/set/video/:video_id/:overlays', set_video.request);


module.exports = router;
