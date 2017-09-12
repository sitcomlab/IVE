// Add overlays
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///overlays.csv' AS line FIELDTERMINATOR ','
CREATE (overlay:Overlays {
    overlay_uuid: line.`overlay_uuid`,
    name: line.`name`,
    description: line.`description`,
    category: line.`category`,
    url: line.`url`,
    created: timestamp(),
    updated: timestamp()
});
