MATCH (o:Overlays)-[r:belongs_to]->(s:Scenarios)
WHERE ID(s)= toInt({scenario_id})
WITH count(*) AS full_count
MATCH (o:Overlays)-[r:belongs_to]->(s:Scenarios)
WHERE ID(s)= toInt({scenario_id})
RETURN
    full_count,
    ID(o) AS overlay_id,
    o.created AS created,
    o.updated AS updated,
    o.overlay_uuid AS overlay_uuid,
    o.name AS name,
    o.description AS description,
    o.category AS category,
    o.url AS url,
    o.distance_meters AS distance_meters,
    o.distance_seconds AS distance_seconds
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN o.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN o.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN o.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN o.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN o.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN o.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
