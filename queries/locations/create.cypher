CREATE (l:Locations {
    created: timestamp(),
    updated: timestamp(),
    location_uuid: {location_uuid},
    name: {name},
    description: {description},
    length: {length},
    lat: {lat},
    lng: {lng},
    location_type: {location_type}
}) RETURN
    ID(l) AS location_id,
    l.created AS created,
    l.updated AS updated,
    l.location_uuid AS location_uuid,
    l.name AS name,
    l.description AS description,
    l.length AS length,
    l.lat AS lat,
    l.lng AS lng,
    l.location_type AS location_type
;
