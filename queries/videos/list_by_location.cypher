MATCH (v:Videos)-[r:recorded_at]->(l:Locations)
WHERE ID(l)= toInt({location_id})
RETURN
    ID(v) AS video_id,
    v.created AS created,
    v.updated AS updated,
    v.v_id AS v_id,
    v.name AS name,
    v.description AS description,
    v.url AS url,
    v.recorded AS recorded
ORDER BY v.name DESC;
