MATCH (o:Overlays)
WHERE ID(o) = toInt({overlay_id})
SET
    o.updated = timestamp(),
    o.overlay_uuid = {overlay_uuid},
    o.name = {name},
    o.description = {description},
    o.category = {category},
    o.url = {url}
RETURN
    ID(o) AS overlay_id,
    o.created AS created,
    o.updated AS updated,
    o.overlay_uuid AS overlay_uuid,
    o.name AS name,
    o.description AS description,
    o.category AS category,
    o.url AS url
;
