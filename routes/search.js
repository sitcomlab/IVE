var express = require('express');
var router = express.Router();

var search_scenarios = require('../controllers/scenarios/search');
var search_locations = require('../controllers/locations/search');
var search_locations_by_scenario = require('../controllers/locations/search_by_scenario');
var search_locations_by_location = require('../controllers/locations/search_by_location');
var search_videos = require('../controllers/videos/search');
var search_videos_by_scenario = require('../controllers/videos/search_by_scenario');
var search_videos_by_location = require('../controllers/videos/search_by_location');
var search_overlays = require('../controllers/overlays/search');
var search_overlays_by_scenario = require('../controllers/overlays/search_by_scenario');
var search_overlays_by_video = require('../controllers/overlays/search_by_video');


// SEARCH SCENARIOS
router.post('/search/scenarios', search_scenarios.request);


// SEARCH LOCATIONS
router.post('/search/locations', search_locations.request);

// SEARCH LOCATIONS BY SCENARIO
router.post('/search/scenarios/:scenario_id/locations', search_locations_by_scenario.request);

// SEARCH LOCATIONS BY LOCATION
router.post('/search/locations/:location_id/locations', search_locations_by_location.request);


// SEARCH VIDEOS
router.post('/search/videos', search_videos.request);

// SEARCH VIDEOS BY SCENARIO
router.post('/search/scenarios/:scenario_id/videos', search_videos_by_scenario.request);

// SEARCH VIDEOS BY LOCATION
router.post('/search/locations/:location_id/videos', search_videos_by_location.request);


// SEARCH OVERLAYS
router.post('/search/overlays', search_overlays.request);

// SEARCH OVERLAYS BY SCENARIO
router.post('/search/scenarios/:scenario_id/overlays', search_overlays_by_scenario.request);

// SEARCH OVERLAYS BY VIDEO
router.post('/search/videos/:video_id/overlays', search_overlays_by_video.request);


module.exports = router;
