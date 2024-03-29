MATCH (o:Overlays)-[r:belongs_to]->(s:Scenarios)
WHERE
    // Overlays
    toLower(o.overlay_uuid) CONTAINS toLower({search_term}) OR
    toLower(o.name) CONTAINS toLower({search_term}) OR
    toLower(o.description) CONTAINS toLower({search_term}) OR
    toLower(o.url) CONTAINS toLower({search_term}) OR
    // Scenarios
    toLower(s.scenario_uuid) CONTAINS toLower({search_term}) OR
    toLower(s.name) CONTAINS toLower({search_term}) OR
    toLower(s.description) CONTAINS toLower({search_term})
WITH count(r) AS full_count
MATCH (o:Overlays)-[r:belongs_to]->(s:Scenarios)
WHERE
    // Overlays
    toLower(o.overlay_uuid) CONTAINS toLower({search_term}) OR
    toLower(o.name) CONTAINS toLower({search_term}) OR
    toLower(o.description) CONTAINS toLower({search_term}) OR
    toLower(o.url) CONTAINS toLower({search_term}) OR
    // Scenarios
    toLower(s.scenario_uuid) CONTAINS toLower({search_term}) OR
    toLower(s.name) CONTAINS toLower({search_term}) OR
    toLower(s.description) CONTAINS toLower({search_term})
RETURN
    full_count,
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
ORDER BY
    CASE WHEN {orderby} = 'created.asc'         THEN r.created END ASC,
    CASE WHEN {orderby} = 'created.desc'        THEN r.created END DESC,
    CASE WHEN {orderby} = 'updated.asc'         THEN r.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc'        THEN r.updated END DESC,
    CASE WHEN {orderby} = 'overlay_name.asc'    THEN o.name END ASC,
    CASE WHEN {orderby} = 'overlay_name.desc'   THEN o.name END DESC,
    CASE WHEN {orderby} = 'scenario_name.asc'   THEN s.name END ASC, o.name ASC,
    CASE WHEN {orderby} = 'scenario_name.desc'  THEN s.name END DESC, o.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
