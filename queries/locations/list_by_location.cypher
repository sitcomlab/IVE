MATCH (start:Locations)-[r:connected_to]->(end:Locations)
WHERE ID(start)= toInt({location_id})
WITH count(*) AS full_count
MATCH (start:Locations)-[r:connected_to]->(end:Locations)
WHERE ID(start)= toInt({location_id})
RETURN
    full_count,
    ID(end) AS location_id,
    end.created AS created,
    end.updated AS updated,
    end.l_id AS l_id,
    end.name AS name,
    end.description AS description,
    end.lat AS lat,
    end.lng AS lng,
    end.location_type AS location_type
ORDER BY end.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
