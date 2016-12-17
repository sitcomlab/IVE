CREATE (o:Overlays {
    created: timestamp(),
    updated: timestamp(),
    o_id: {o_id},
    name: {name},
    description: {description},
    category: {category},
    url: {url}
}) RETURN
    ID(o) AS overlay_id,
    o.created AS created,
    o.updated AS updated,
    o.o_id AS o_id,
    o.name AS name,
    o.description AS description,
    o.category AS category,
    o.url AS url
;
