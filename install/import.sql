// Delete all nodes and relationships (Reset)
MATCH (n) DETACH DELETE n


// Add scenarios
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/scenarios.csv' AS line FIELDTERMINATOR ','
WITH line
CREATE (scenario:Scenarios {
    scenario_id: line.`scenario_id`,
    name: line.`name`,
    description: line.`description`,
    created: timestamp(),
    updated: timestamp()
});


// Add locations
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/locations.csv' AS line FIELDTERMINATOR ','
CREATE (location:Locations {
    location_id: line.`location_id`,
    name: line.`name`,
    description: line.`description`,
    lat: toFloat(line.`lat`),
    lon: toFloat(line.`lon`),
    indoor: line.`indoor`,
    created: timestamp(),
    updated: timestamp()
})
WITH line, location
MATCH (scenario:Scenarios) WHERE scenario.scenario_id = line.`scenario_id`
CREATE (location)-[:belongs_to]->(scenario);



// Add videos
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/videos.csv' AS line FIELDTERMINATOR ','
CREATE (video:Videos {
    video_id: line.`video_id`,
    name: line.`name`,
    description: line.`description`,
    created: timestamp(),
    updated: timestamp()
})
WITH line, video
MATCH (scenario:Scenarios) WHERE scenario.scenario_id = line.`scenario_id`
CREATE (video)-[:belongs_to]->(scenario);


// Add overlays
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/overlays.csv' AS line FIELDTERMINATOR ','
CREATE (overlay:Overlays {
    overlay_id: line.`overlay_id`,
    name: line.`name`,
    description: line.`description`,
    type: line.`type`,
    url: line.`url`,
    created: timestamp(),
    updated: timestamp()
})
WITH line, overlay
MATCH (scenario:Scenarios) WHERE scenario.scenario_id = line.`scenario_id`
CREATE (overlay)-[:belongs_to]->(scenario);


// Add connected_to relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/connected_to.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location_1:Locations) WHERE location_1.location_id = line.`start_id`
MATCH (location_2:Locations) WHERE location_2.location_id = line.`end_id`
CREATE (location_1)-[:connected_to {
    weight: line.`weight`,
    intents: line.`intents`
}]->(location_2);


// Add recorded_at relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/recorded_at.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (location:Locations) WHERE location.location_id = line.`location_id`
MATCH (video:Videos) WHERE video.video_id = line.`video_id`
CREATE (video)-[:recorded_at]->(location);


// Add embedded_in relationships
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/sitcomlab/IVE/master/data/embedded_in.csv' AS line FIELDTERMINATOR ','
WITH line
MATCH (overlay:Overlays) WHERE overlay.overlay_id = line.`overlay_id`
MATCH (video:Videos) WHERE video.video_id = line.`video_id`
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
