// Delete all nodes and relationships (Reset)
MATCH (n) DETACH DELETE n;


// Alternative import path: https://raw.githubusercontent.com/sitcomlab/IVE/master/data/FILENAME.csv

// Add scenarios
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///scenarios.csv' AS line FIELDTERMINATOR ','
WITH line
CREATE (scenario:Scenarios {
    s_id: line.`s_id`,
    name: line.`name`,
    description: line.`description`,
    created: timestamp(),
    updated: timestamp()
});


// Add locations
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///locations.csv' AS line FIELDTERMINATOR ','
CREATE (location:Locations {
    l_id: line.`l_id`,
    name: line.`name`,
    description: line.`description`,
    lat: toFloat(line.`lat`),
    lng: toFloat(line.`lng`),
    location_type: line.`location_type`,
    created: timestamp(),
    updated: timestamp()
})
WITH line, location
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (location)-[:belongs_to]->(scenario);


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
})
WITH line, video
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (video)-[:belongs_to]->(scenario);


// Add overlays
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///overlays.csv' AS line FIELDTERMINATOR ','
CREATE (overlay:Overlays {
    o_id: line.`o_id`,
    name: line.`name`,
    description: line.`description`,
    type: line.`type`,
    url: line.`url`,
    created: timestamp(),
    updated: timestamp()
})
WITH line, overlay
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (overlay)-[:belongs_to]->(scenario);


// Add parent_location relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///parent_location.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (child:Locations) WHERE child.l_id = line.`child_id`
MATCH (parent:Locations) WHERE parent.l_id = line.`parent_id`
CREATE (child)-[:parent_location]->(parent);


// Add connected_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///connected_to.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location_1:Locations) WHERE location_1.l_id = line.`start_id`
MATCH (location_2:Locations) WHERE location_2.l_id = line.`end_id`
CREATE (location_1)-[:connected_to {
    weight: line.`weight`,
    intents: line.`intents`
}]->(location_2);


// Add recorded_at relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///recorded_at.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location:Locations) WHERE location.l_id = line.`l_id`
MATCH (video:Videos) WHERE video.v_id = line.`v_id`
CREATE (video)-[:recorded_at {
    preferred: (CASE toInt(line.`preferred`) WHEN 1 THEN true ELSE false END)
}]->(location);


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


// Check the result
MATCH (n) RETURN (n);
