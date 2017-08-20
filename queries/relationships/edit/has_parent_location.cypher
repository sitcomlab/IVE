MATCH (child:Locations)-[r:has_parent_location]->(parent:Locations)
WHERE ID(r)=toInt({relationship_id})
SET
    r.updated = timestamp()
RETURN
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
;
