// Add belongs_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///belongs_to_locations.csv' AS line FIELDTERMINATOR ','
MATCH (location:Locations) WHERE location.l_id = line.`l_id`
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (location)-[:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(scenario);
