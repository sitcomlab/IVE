CREATE (o:Overlays {
    created: timestamp(),
    updated: timestamp(),
    overlay_uuid: {overlay_uuid},
    name: {name},
    description: {description},
    category: {category},
    url: {url},
    distance_meters: {distance_meters},
    distance_seconds: {distance_seconds}
}) RETURN
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
