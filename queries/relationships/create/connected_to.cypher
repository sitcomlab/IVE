MATCH (start:Locations) WHERE ID(start) = toInt({start_location_id})
MATCH (end:Locations) WHERE ID(end) = toInt({end_location_id})
CREATE (start)-[r:connected_to {
    created: timestamp(),
    updated: timestamp()
}]->(end)
RETURN
    ID(start) AS start_location_id,
    start.created AS start_location_created,
    start.updated AS start_location_updated,
    start.location_uuid AS start_location_uuid,
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
    end.location_uuid AS end_location_uuid,
    end.name AS end_location_name,
    end.description AS end_location_description,
    end.lat AS end_location_lat,
    end.lng AS end_location_lng,
    end.location_type AS end_location_type
;
