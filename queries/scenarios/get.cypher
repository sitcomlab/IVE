MATCH (s:Scenarios)
WHERE ID(s) = toInt({scenario_id})
RETURN
    ID(s) AS scenario_id,
    s.created AS created,
    s.updated AS updated,
    s.scenario_uuid AS scenario_uuid,
    s.name AS name,
    s.description AS description
;
