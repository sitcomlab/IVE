MATCH (child:Locations)-[r:has_parent_location]->(parent:Locations)
WHERE
    // Child locations
    toLower(child.l_id) CONTAINS toLower({search_term}) OR
	toLower(child.name) CONTAINS toLower({search_term}) OR
	toLower(child.description) CONTAINS toLower({search_term}) OR
	child.lat CONTAINS toLower({search_term}) OR
	child.lng CONTAINS toLower({search_term}) OR
    // Parent locations
    toLower(parent.l_id) CONTAINS toLower({search_term}) OR
	toLower(parent.name) CONTAINS toLower({search_term}) OR
	toLower(parent.description) CONTAINS toLower({search_term}) OR
	parent.lat CONTAINS toLower({search_term}) OR
	parent.lng CONTAINS toLower({search_term})
WITH count(r) AS full_count
MATCH (child:Locations)-[r:has_parent_location]->(parent:Locations)
WHERE
    // Child locations
    toLower(child.l_id) CONTAINS toLower({search_term}) OR
    toLower(child.name) CONTAINS toLower({search_term}) OR
    toLower(child.description) CONTAINS toLower({search_term}) OR
    child.lat CONTAINS toLower({search_term}) OR
    child.lng CONTAINS toLower({search_term}) OR
    // Parent locations
    toLower(parent.l_id) CONTAINS toLower({search_term}) OR
    toLower(parent.name) CONTAINS toLower({search_term}) OR
    toLower(parent.description) CONTAINS toLower({search_term}) OR
    parent.lat CONTAINS toLower({search_term}) OR
    parent.lng CONTAINS toLower({search_term})
RETURN
    full_count,
    ID(child) AS child_location_id,
    child.created AS child_location_created,
    child.updated AS child_location_updated,
    child.l_id AS child_l_id,
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
    parent.l_id AS parent_l_id,
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
