// Add constraints (execute one by one)
CREATE CONSTRAINT ON (scenario:Scenarios) ASSERT scenario.s_id IS UNIQUE;

CREATE CONSTRAINT ON (location:Locations) ASSERT location.l_id IS UNIQUE;

CREATE CONSTRAINT ON (video:Videos) ASSERT video.v_id IS UNIQUE;

CREATE CONSTRAINT ON (overlay:Overlays) ASSERT overlay.o_id IS UNIQUE;


// Check constraints
:schema


// Deleting constraints
// DROP CONSTRAINT ON (label:Label) ASSERT label.l_id IS UNIQUE;
