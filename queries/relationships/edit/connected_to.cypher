MATCH (start:Locations)-[r:connected_to]->(end:Locations)
WHERE ID(r)=toInt({relationship_id})
SET
    r.updated = timestamp(),
    r.i_id = {i_id}
RETURN
    ID(start) AS start_location_id,
    start.created AS start_location_created,
    start.updated AS start_location_updated,
    start.l_id AS start_l_id,
    start.name AS start_location_name,
    start.description AS start_location_description,
    start.lat AS start_location_lat,
    start.lng AS start_location_lng,
    start.location_type AS start_location_type,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    r.i_id AS relationship_i_id,
    ID(end) AS end_location_id,
    end.created AS end_location_created,
    end.updated AS end_location_updated,
    end.l_id AS end_l_id,
    end.name AS end_location_name,
    end.description AS end_location_description,
    end.lat AS end_location_lat,
    end.lng AS end_location_lng,
    end.location_type AS end_location_type
;
