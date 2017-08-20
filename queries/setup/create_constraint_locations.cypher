// Unique Location Id
CREATE CONSTRAINT ON (location:Locations) ASSERT location.location_uuid IS UNIQUE;
