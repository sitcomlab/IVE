MATCH (s:Scenarios)
WHERE ID(s) = toInt({scenario_id})
SET
    s.s_id = {s_id},
    s.name = {name},
    s.description = {description},
    s.updated = timestamp()
RETURN
    ID(s) AS scenario_id,
    s.s_id AS s_id,
    s.name AS name,
    s.description AS description,
    s.created AS created,
    s.updated AS updated
;
