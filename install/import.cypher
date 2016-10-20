// Delete all nodes and relationships (Reset)
MATCH (n) DETACH DELETE n;


// Add scenarios
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/scenarios.csv' AS line FIELDTERMINATOR ','
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
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/locations.csv' AS line FIELDTERMINATOR ','
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
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/videos.csv' AS line FIELDTERMINATOR ','
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
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/overlays.csv' AS line FIELDTERMINATOR ','
CREATE (overlay:Overlays {
    o_id: line.`o_id`,
    name: line.`name`,
    description: line.`description`,
    type: line.`type`,
    url: line.`url`,
    display: (case line.`display` WHEN 1 THEN true ELSE false END),
    created: timestamp(),
    updated: timestamp()
})
WITH line, overlay
MATCH (scenario:Scenarios) WHERE scenario.s_id = line.`s_id`
CREATE (overlay)-[:belongs_to]->(scenario);


// Add parent_location relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/parent_location.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (child:Locations) WHERE child.l_id = line.`child`
MATCH (parent:Locations) WHERE parent.l_id = line.`parent`
CREATE (child)-[:parent_location]->(parent);


// Add connected_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/connected_to.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location_1:Locations) WHERE location_1.l_id = line.`start_id`
MATCH (location_2:Locations) WHERE location_2.l_id = line.`end_id`
CREATE (location_1)-[:connected_to {
    weight: line.`weight`,
    intents: line.`intents`
}]->(location_2);


// Add recorded_at relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/recorded_at.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location:Locations) WHERE location.l_id = line.`l_id`
MATCH (video:Videos) WHERE video.v_id = line.`v_id`
CREATE (video)-[:recorded_at]->(location);


// Add embedded_in relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/embedded_in.csv' AS line FIELDTERMINATOR ','
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
    rz: line.`rz`
}]->(video);


// Check the result
MATCH (n) RETURN (n);
