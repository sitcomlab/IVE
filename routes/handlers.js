var express = require('express');
var router = express.Router();

var set_scenario = require('../controllers/handlers/set_scenario');
var set_location = require('../controllers/handlers/set_location');
var set_video = require('../controllers/handlers/set_video');


// SET SCENARIO
router.get('/handlers/set/scenario/:scenario_id', set_scenario.request);

// SET LOCATION
router.get('/handlers/set/location/:location_id', set_location.request);

// SET VIDEO
router.get('/handlers/set/video/:video_id', set_video.request);


module.exports = router;
