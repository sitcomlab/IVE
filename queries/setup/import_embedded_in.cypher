// Add embedded_in relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///embedded_in.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (overlay:Overlays) WHERE overlay.overlay_uuid = line.`overlay_uuid`
MATCH (video:Videos) WHERE video.video_uuid = line.`video_uuid`
CREATE (overlay)-[:embedded_in {
    created: timestamp(),
    updated: timestamp(),
    description: (line.`description`),
    w: toFloat(line.`w`),
    h: toFloat(line.`h`),
    x: toFloat(line.`x`),
    y: toFloat(line.`y`),
    z: toFloat(line.`z`),
    d: toFloat(line.`d`),
    rx: toFloat(line.`rx`),
    ry: toFloat(line.`ry`),
    rz: toFloat(line.`rz`),
    display: (CASE toInt(line.`display`) WHEN 1 THEN true ELSE false END)
}]->(video);
