MATCH (start:Locations)-[r1:connected_to]->(l:Locations)-[r2:parent_location]->(parent:Locations)
WHERE ID(start)= toInt({location_id})
RETURN
    ID(l) AS location_id,
    l.created AS created,
    l.updated AS updated,
    l.l_id AS l_id,
    l.name AS name,
    l.description AS description,
    l.lat AS lat,
    l.lng AS lng,
    l.location_type AS location_type
    ID(parent) AS parent_location_id,
    parent.created AS parent_created,
    parent.updated AS parent_updated,
    parent.l_id AS parent_l_id,
    parent.name AS parent_name,
    parent.description AS parent_description,
    parent.lat AS parent_lat,
    parent.lng AS parent_lng,
    parent.location_type AS parent_type
ORDER BY parent.name, l.name DESC;
