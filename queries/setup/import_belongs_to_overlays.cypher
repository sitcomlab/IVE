// Add belongs_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///belongs_to_overlays.csv' AS line FIELDTERMINATOR ','
MATCH (overlay:Overlays) WHERE overlay.o_id = line.`o_id`
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (overlay)-[:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(scenario);
