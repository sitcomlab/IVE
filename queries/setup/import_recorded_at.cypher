// Add recorded_at relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///recorded_at.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location:Locations) WHERE location.location_uuid = line.`location_uuid`
MATCH (video:Videos) WHERE video.video_uuid = line.`video_uuid`
CREATE (video)-[:recorded_at {
    created: timestamp(),
    updated: timestamp(),
    description: (line.`description`),
    preferred: (CASE toInt(line.`preferred`) WHEN 1 THEN true ELSE false END)
}]->(location);
