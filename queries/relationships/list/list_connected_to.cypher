MATCH (start:Locations)-[r:connected_to]->(end:Locations)
WITH count(r) AS full_count
MATCH (start:Locations)-[r:connected_to]->(end:Locations)
RETURN
    full_count,
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
    ID(end) AS end_location_id,
    end.created AS end_location_created,
    end.updated AS end_location_updated,
    end.l_id AS end_l_id,
    end.name AS end_location_name,
    end.description AS end_location_description,
    end.lat AS end_location_lat,
    end.lng AS end_location_lng,
    end.location_type AS end_location_type
ORDER BY
    CASE WHEN {orderby} = 'created.asc'                 THEN r.created END ASC,
    CASE WHEN {orderby} = 'created.desc'                THEN r.created END DESC,
    CASE WHEN {orderby} = 'updated.asc'                 THEN r.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc'                THEN r.updated END DESC,
    CASE WHEN {orderby} = 'start_location_name.asc'     THEN start.name END ASC,
    CASE WHEN {orderby} = 'start_location_name.desc'    THEN start.name END DESC,
    CASE WHEN {orderby} = 'end_location_name.asc'       THEN end.name END ASC, start.name ASC,
    CASE WHEN {orderby} = 'end_location_name.desc'      THEN end.name END DESC, start.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
