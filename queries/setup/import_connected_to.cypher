// Add connected_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///connected_to.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location_1:Locations) WHERE location_1.location_uuid = line.`start_location_uuid`
MATCH (location_2:Locations) WHERE location_2.location_uuid = line.`end_location_uuid`
CREATE (location_1)-[:connected_to {
    created: timestamp(),
    updated: timestamp()
}]->(location_2);
