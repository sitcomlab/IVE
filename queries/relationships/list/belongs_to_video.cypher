MATCH (v:Videos)-[r:belongs_to]->(s:Scenarios)
WITH count(r) AS full_count
MATCH (v:Videos)-[r:belongs_to]->(s:Scenarios)
RETURN
    full_count,
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.v_id AS v_id,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.s_id AS s_id,
    s.name AS scenario_name,
    s.description AS scenario_description
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN r.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN r.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN r.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN r.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN v.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN v.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
