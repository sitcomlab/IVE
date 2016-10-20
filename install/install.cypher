// Add constraints
CREATE CONSTRAINT ON (scenario:Scenarios) ASSERT scenario.scenario_id IS UNIQUE;
CREATE CONSTRAINT ON (location:Locations) ASSERT location.location_id IS UNIQUE;
CREATE CONSTRAINT ON (video:Videos) ASSERT video.video_id IS UNIQUE;
CREATE CONSTRAINT ON (overlay:Overlays) ASSERT overlay.overlay_id IS UNIQUE;

// Check constraints
:schema
