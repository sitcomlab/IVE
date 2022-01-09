MATCH (o:Overlays)-[r:embedded_in]->(v:Videos)
WHERE
        o.category = {category}
    AND
        ID(v)= toInt({video_id})
    AND (
        toLower(o.overlay_uuid) CONTAINS toLower({search_term}) OR
        toLower(o.name) CONTAINS toLower({search_term}) OR
        toLower(o.description) CONTAINS toLower({search_term}) OR
        toLower(o.url) CONTAINS toLower({search_term})
    )
WITH count(*) AS full_count
MATCH (o:Overlays)-[r:embedded_in]->(v:Videos)
WHERE
        o.category = {category}
    AND
        ID(v)= toInt({video_id})
    AND (
        toLower(o.overlay_uuid) CONTAINS toLower({search_term}) OR
        toLower(o.name) CONTAINS toLower({search_term}) OR
        toLower(o.description) CONTAINS toLower({search_term}) OR
        toLower(o.url) CONTAINS toLower({search_term})
    )
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
    o.distance_seconds AS distance_seconds,
    r.display AS display
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN o.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN o.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN o.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN o.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN o.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN o.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
