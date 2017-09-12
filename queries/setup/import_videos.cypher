// Add videos
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///videos.csv' AS line FIELDTERMINATOR ','
CREATE (video:Videos {
    video_uuid: line.`video_uuid`,
    name: line.`name`,
    description: line.`description`,
    url: line.`url`,
    recorded: line.`recorded`,
    thumbnails: line.`thumbnails`,
    created: timestamp(),
    updated: timestamp()
});
