MATCH (v:Videos)-[r:recorded_at]->(l:Locations)
WHERE
    ID(l)= toInt({location_id}) AND (
        toLower(v.v_id) CONTAINS toLower({search_term}) OR
        toLower(v.name) CONTAINS toLower({search_term}) OR
        toLower(v.description) CONTAINS toLower({search_term}) OR
        toLower(v.url) CONTAINS toLower({search_term}) OR
        toLower(v.recorded) CONTAINS toLower({search_term})
    )
WITH count(*) AS full_count
MATCH (v:Videos)-[r:recorded_at]->(l:Locations)
WHERE
    ID(l)= toInt({location_id})  AND (
        toLower(v.v_id) CONTAINS toLower({search_term}) OR
        toLower(v.name) CONTAINS toLower({search_term}) OR
        toLower(v.description) CONTAINS toLower({search_term}) OR
        toLower(v.url) CONTAINS toLower({search_term}) OR
        toLower(v.recorded) CONTAINS toLower({search_term})
    )
RETURN
    full_count,
    ID(v) AS video_id,
    v.created AS created,
    v.updated AS updated,
    v.v_id AS v_id,
    v.name AS name,
    v.description AS description,
    v.url AS url,
    v.recorded AS recorded,
    r.preferred AS preferred
ORDER BY v.name DESC
SKIP toInt({skip})
LIMIT toInt({limit});


WITH count(*) AS full_count
MATCH (v:Videos)
WHERE
    v.v_id CONTAINS toLower({search_term}) OR
    v.name CONTAINS toLower({search_term}) OR
    v.description CONTAINS toLower({search_term}) OR
    v.url CONTAINS toLower({search_term}) OR
    v.recorded CONTAINS toLower({search_term})
RETURN
    ID(v) AS video_id,
    v.created AS created,
    v.updated AS updated,
    v.v_id AS v_id,
    v.name AS name,
    v.description AS description,
    v.url AS url,
    v.recorded AS recorded
ORDER BY v.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
