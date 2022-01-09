MATCH (o:Overlays)
WHERE ID(o)= toInt({overlay_id})
RETURN
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
;
