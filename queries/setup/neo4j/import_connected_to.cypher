// Add connected_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///connected_to.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location_1:Locations) WHERE location_1.l_id = line.`start_id`
MATCH (location_2:Locations) WHERE location_2.l_id = line.`end_id`
CREATE (location_1)-[:connected_to {
    created: timestamp(),
    updated: timestamp(),
    i_id: toFloat(line.`i_id`)
}]->(location_2);
