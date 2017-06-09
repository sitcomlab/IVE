MATCH (l:Locations)-[r:belongs_to]->(s:Scenarios)
WHERE ID(s)= toInt({scenario_id})
WITH count(*) AS full_count
MATCH (l:Locations)-[r:belongs_to]->(s:Scenarios)
WHERE ID(s)= toInt({scenario_id})
RETURN
    full_count,
    ID(l) AS location_id,
    l.created AS created,
    l.updated AS updated,
    l.l_id AS l_id,
    l.name AS name,
    l.description AS description,
    l.lat AS lat,
    l.lng AS lng,
    l.location_type AS location_type
ORDER BY l.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
