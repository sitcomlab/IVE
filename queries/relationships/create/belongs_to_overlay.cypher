MATCH (o:Overlays) WHERE ID(o) = toInt({overlay_id})
MATCH (s:Scenarios) WHERE ID(s) = toInt({scenario_id})
CREATE (o)-[r:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(s)
RETURN
    ID(o) AS overlay_id,
    o.created AS overlay_created,
    o.updated AS overlay_updated,
    o.overlay_uuid AS overlay_uuid,
    o.name AS overlay_name,
    o.description AS overlay_description,
    o.category AS overlay_category,
    o.url AS overlay_url,
    o.title AS overlay_title,
    o.distance_meters AS overlay_distance_meters,
    o.distance_seconds AS overlay_distance_seconds,
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
