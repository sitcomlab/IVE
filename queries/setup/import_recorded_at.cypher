// Add recorded_at relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///recorded_at.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location:Locations) WHERE location.l_id = line.`l_id`
MATCH (video:Videos) WHERE video.v_id = line.`v_id`
CREATE (video)-[:recorded_at {
    created: timestamp(),
    updated: timestamp(),
    preferred: (CASE toInt(line.`preferred`) WHEN 1 THEN true ELSE false END)
}]->(location);
