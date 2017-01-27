// Unique Location Id
CREATE CONSTRAINT ON (location:Locations) ASSERT location.l_id IS UNIQUE;
