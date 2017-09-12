MATCH (l:Locations)
WHERE ID(l)= toInt({location_id})
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
