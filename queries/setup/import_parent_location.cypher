// Add parent_location relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///parent_location.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (child:Locations) WHERE child.l_id = line.`child_id`
MATCH (parent:Locations) WHERE parent.l_id = line.`parent_id`
CREATE (child)-[:parent_location {
    created: timestamp(),
    updated: timestamp()
}]->(parent);
