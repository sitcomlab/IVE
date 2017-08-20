MATCH (l:Locations)-[r:belongs_to]->(s:Scenarios)
WHERE ID(r)=toInt({relationship_id})
RETURN
    ID(l) AS location_id,
    l.created AS location_created,
    l.updated AS location_updated,
    l.location_uuid AS location_uuid,
    l.name AS location_name,
    l.description AS location_description,
    l.lat AS location_lat,
    l.lng AS location_lng,
    l.location_type AS location_type,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.scenario_uuid AS scenario_uuid,
    s.name AS scenario_name,
    s.description AS scenario_description
;
