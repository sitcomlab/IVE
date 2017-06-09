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
ORDER BY s.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
