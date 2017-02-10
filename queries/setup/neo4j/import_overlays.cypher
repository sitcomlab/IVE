// Add overlays
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///overlays.csv' AS line FIELDTERMINATOR ','
CREATE (overlay:Overlays {
    o_id: line.`o_id`,
    name: line.`name`,
    description: line.`description`,
    category: line.`category`,
    url: line.`url`,
    created: timestamp(),
    updated: timestamp()
});
