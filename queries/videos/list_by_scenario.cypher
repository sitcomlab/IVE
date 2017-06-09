MATCH (v:Videos)-[r:belongs_to]->(s:Scenarios)
WHERE ID(s)= toInt({scenario_id})
WITH count(*) AS full_count
MATCH (v:Videos)-[r:belongs_to]->(s:Scenarios)
WHERE ID(s)= toInt({scenario_id})
RETURN
    full_count,
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
