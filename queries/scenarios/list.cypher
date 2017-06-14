MATCH (s:Scenarios)
WITH count(*) AS full_count
MATCH (s:Scenarios)
RETURN
    full_count,
    ID(s) AS scenario_id,
    s.created AS created,
    s.updated AS updated,
    s.s_id AS s_id,
    s.name AS name,
    s.description AS description
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN s.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN s.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN s.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN s.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN s.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN s.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
