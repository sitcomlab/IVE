MATCH (o:Overlays)
WHERE
    toLower(o.o_id) CONTAINS toLower({search_term}) OR
    toLower(o.name) CONTAINS toLower({search_term}) OR
    toLower(o.description) CONTAINS toLower({search_term}) OR
    toLower(o.url) CONTAINS toLower({search_term})
WITH count(*) AS full_count
MATCH (o:Overlays)
WHERE
    toLower(o.o_id) CONTAINS toLower({search_term}) OR
    toLower(o.name) CONTAINS toLower({search_term}) OR
    toLower(o.description) CONTAINS toLower({search_term}) OR
    toLower(o.url) CONTAINS toLower({search_term})
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
