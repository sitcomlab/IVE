// Unique Overlay Id
CREATE CONSTRAINT ON (overlay:Overlays) ASSERT overlay.overlay_uuid IS UNIQUE;
