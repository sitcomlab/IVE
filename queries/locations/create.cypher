CREATE (l:Locations {
    created: timestamp(),
    updated: timestamp(),
    l_id: {l_id},
    name: {name},
    description: {description},
    lat: {lat},
    lng: {lng},
    location_type: {location_type}
}) RETURN
    ID(l) AS location_id,
    l.created AS created,
    l.updated AS updated,
    l.l_id AS l_id,
    l.name AS name,
    l.description AS description,
    l.lat AS lat,
    l.lng AS lng,
    l.location_type AS location_type
;
