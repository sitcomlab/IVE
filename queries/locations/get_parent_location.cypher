MATCH (child:Locations)-[r:parent_location]->(parent:Locations)
WHERE ID(child)= toInt({location_id})
RETURN
    ID(parent) AS parent_location_id,
    parent.created AS parent_created,
    parent.updated AS parent_updated,
    parent.l_id AS parent_l_id,
    parent.name AS parent_name,
    parent.description AS parent_description,
    parent.lat AS parent_lat,
    parent.lng AS parent_lng,
    parent.location_type AS parent_type
ORDER BY parent.name DESC;
