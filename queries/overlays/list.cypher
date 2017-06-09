MATCH (o:Overlays)
WITH count(*) AS full_count
MATCH (o:Overlays)
RETURN
    full_count,
    ID(o) AS overlay_id,
    o.created AS created,
    o.updated AS updated,
    o.o_id AS o_id,
    o.name AS name,
    o.description AS description,
    o.category AS category,
    o.url AS url
ORDER BY o.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
