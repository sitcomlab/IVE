// Add has_parent_location relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///has_parent_location.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (child:Locations) WHERE child.location_uuid = line.`child_location_uuid`
MATCH (parent:Locations) WHERE parent.location_uuid = line.`parent_location_uuid`
CREATE (child)-[:has_parent_location {
    created: timestamp(),
    updated: timestamp()
}]->(parent);
