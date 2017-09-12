MATCH (child:Locations)-[r:has_parent_location]->(parent:Locations)
WITH count(r) AS full_count
MATCH (child:Locations)-[r:has_parent_location]->(parent:Locations)
RETURN
    full_count,
    ID(child) AS child_location_id,
    child.created AS child_location_created,
    child.updated AS child_location_updated,
    child.location_uuid AS child_location_uuid,
    child.name AS child_location_name,
    child.description AS child_location_description,
    child.lat AS child_location_lat,
    child.lng AS child_location_lng,
    child.location_type AS child_location_type,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(parent) AS parent_location_id,
    parent.created AS parent_location_created,
    parent.updated AS parent_location_updated,
    parent.location_uuid AS parent_location_uuid,
    parent.name AS parent_location_name,
    parent.description AS parent_location_description,
    parent.lat AS parent_location_lat,
    parent.lng AS parent_location_lng,
    parent.location_type AS parent_location_type
ORDER BY
    CASE WHEN {orderby} = 'created.asc'                 THEN r.created END ASC,
    CASE WHEN {orderby} = 'created.desc'                THEN r.created END DESC,
    CASE WHEN {orderby} = 'updated.asc'                 THEN r.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc'                THEN r.updated END DESC,
    CASE WHEN {orderby} = 'child_location_name.asc'     THEN child.name END ASC,
    CASE WHEN {orderby} = 'child_location_name.desc'    THEN child.name END DESC,
    CASE WHEN {orderby} = 'parent_location_name.asc'    THEN parent.name END ASC, child.name ASC,
    CASE WHEN {orderby} = 'parent_location_name.desc'   THEN parent.name END DESC, child.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
