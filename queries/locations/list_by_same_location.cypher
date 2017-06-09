MATCH (child:Locations)-[r:connected_to]->(parent:Locations)
WHERE ID(child)= toInt({location_id})
WITH count(*) AS full_count
MATCH (child:Locations)-[r:connected_to]->(parent:Locations)
WHERE ID(child)= toInt({location_id})
RETURN
    full_count,
    ID(child) AS location_id,
    child.created AS created,
    child.updated AS updated,
    child.l_id AS l_id,
    child.name AS name,
    child.description AS description,
    child.lat AS lat,
    child.lng AS lng,
    child.location_type AS location_type,
    ID(parent) AS parent_location_id,
    parent.created AS parent_created,
    parent.updated AS parent_updated,
    parent.l_id AS parent_l_id,
    parent.name AS parent_name,
    parent.description AS parent_description,
    parent.lat AS parent_lat,
    parent.lng AS parent_lng,
    parent.location_type AS parent_location_type
ORDER BY l.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
