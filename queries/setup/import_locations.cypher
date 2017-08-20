// Add locations
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM 'file:///locations.csv' AS line FIELDTERMINATOR ','
CREATE (location:Locations {
    location_uuid: line.`location_uuid`,
    name: line.`name`,
    description: line.`description`,
    lat: toFloat(line.`lat`),
    lng: toFloat(line.`lng`),
    location_type: line.`location_type`,
    created: timestamp(),
    updated: timestamp()
});
