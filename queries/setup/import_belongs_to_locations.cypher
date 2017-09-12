// Add belongs_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///belongs_to_locations.csv' AS line FIELDTERMINATOR ','
MATCH (location:Locations) WHERE location.location_uuid = line.`location_uuid`
MATCH (scenario:Scenarios) WHERE scenario.scenario_uuid = line.`scenario_uuid`
CREATE (location)-[:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(scenario);
