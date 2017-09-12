// Add belongs_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///belongs_to_overlays.csv' AS line FIELDTERMINATOR ','
MATCH (overlay:Overlays) WHERE overlay.overlay_uuid = line.`overlay_uuid`
MATCH (scenario:Scenarios) WHERE scenario.scenario_uuid = line.`scenario_uuid`
CREATE (overlay)-[:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(scenario);
