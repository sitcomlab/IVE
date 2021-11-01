MATCH (start:Locations)-[r:connected_to]->(end:Locations)
WHERE
        start.location_type = {location_type}
    AND
        ID(start)= toInt({location_id})
WITH count(*) AS full_count
MATCH (start:Locations)-[r:connected_to]->(end:Locations)
WHERE
        start.location_type = {location_type}
    AND
        ID(start)= toInt({location_id})
RETURN
    full_count,
    ID(end) AS location_id,
    end.created AS created,
    end.updated AS updated,
    end.location_uuid AS location_uuid,
    end.name AS name,
    end.description AS description,
    l.length AS length,
    end.lat AS lat,
    end.lng AS lng,
    end.location_type AS location_type
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN end.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN end.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN end.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN end.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN end.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN end.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
