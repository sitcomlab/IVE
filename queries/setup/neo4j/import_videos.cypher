// Add videos
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///videos.csv' AS line FIELDTERMINATOR ','
CREATE (video:Videos {
    v_id: line.`v_id`,
    name: line.`name`,
    description: line.`description`,
    url: line.`url`,
    recorded: line.`recorded`,
    created: timestamp(),
    updated: timestamp()
});
