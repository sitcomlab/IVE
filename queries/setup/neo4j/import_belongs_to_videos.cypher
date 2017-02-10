// Add belongs_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///belongs_to_videos.csv' AS line FIELDTERMINATOR ','
MATCH (video:Videos) WHERE video.v_id = line.`v_id`
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (video)-[:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(scenario);
