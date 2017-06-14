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
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN v.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN v.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN v.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN v.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN v.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN v.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
