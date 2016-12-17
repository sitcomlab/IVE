MATCH (o:Overlays)
WHERE ID(l) = toInt({location_id})
SET
    o.updated = timestamp(),
    o.o_id = {o_id},
    o.name = {name},
    o.description = {description},
    o.category = {category},
    o.url = {url}
RETURN
    ID(o) AS overlay_id,
    o.created AS created,
    o.updated AS updated,
    o.o_id AS o_id,
    o.name AS name,
    o.description AS description,
    o.category AS category,
    o.url AS url
;
