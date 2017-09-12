MATCH (l:Locations)
WHERE ID(l) = toInt({location_id})
SET
    l.updated = timestamp(),
    l.location_uuid = {location_uuid},
    l.name = {name},
    l.description = {description},
    l.lat = {lat},
    l.lng = {lng},
    l.location_type = {location_type}
RETURN
    ID(l) AS location_id,
    l.created AS created,
    l.updated AS updated,
    l.location_uuid AS location_uuid,
    l.name AS name,
    l.description AS description,
    l.lat AS lat,
    l.lng AS lng,
    l.location_type AS location_type
;
