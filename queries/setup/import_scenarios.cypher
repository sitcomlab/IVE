// Add scenarios
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///scenarios.csv' AS line FIELDTERMINATOR ','
WITH line
CREATE (scenario:Scenarios {
    scenario_uuid: line.`scenario_uuid`,
    name: line.`name`,
    description: line.`description`,
    created: timestamp(),
    updated: timestamp()
});
