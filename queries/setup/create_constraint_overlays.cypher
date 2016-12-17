// Unique Overlay Id
CREATE CONSTRAINT ON (overlay:Overlays) ASSERT overlay.o_id IS UNIQUE;
