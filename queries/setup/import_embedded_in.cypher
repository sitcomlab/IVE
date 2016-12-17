// Add embedded_in relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///embedded_in.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (overlay:Overlays) WHERE overlay.o_id = line.`o_id`
MATCH (video:Videos) WHERE video.v_id = line.`v_id`
CREATE (overlay)-[:embedded_in {
    w: line.`w`,
    h: line.`h`,
    x: line.`x`,
    y: line.`y`,
    z: line.`z`,
    d: line.`d`,
    rx: line.`rx`,
    ry: line.`ry`,
    rz: line.`rz`,
    display: (CASE toInt(line.`display`) WHEN 1 THEN true ELSE false END)
}]->(video);
