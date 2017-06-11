MATCH (s:Scenarios)
WHERE
    toLower(s.s_id) CONTAINS toLower({search_term}) OR
    toLower(s.name) CONTAINS toLower({search_term}) OR
    toLower(s.description) CONTAINS toLower({search_term})
WITH count(*) AS full_count
MATCH (s:Scenarios)
WHERE
    toLower(s.s_id) CONTAINS toLower({search_term}) OR
    toLower(s.name) CONTAINS toLower({search_term}) OR
    toLower(s.description) CONTAINS toLower({search_term})
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
