// Create abstractLocations label
MATCH (l:Locations) WHERE l.location_type = 'abstract'
SET l :abstractLocations
RETURN l;
