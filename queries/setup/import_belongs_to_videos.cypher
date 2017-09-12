// Add belongs_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///belongs_to_videos.csv' AS line FIELDTERMINATOR ','
MATCH (video:Videos) WHERE video.video_uuid = line.`video_uuid`
MATCH (scenario:Scenarios) WHERE scenario.scenario_uuid = line.`scenario_uuid`
CREATE (video)-[:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(scenario);
