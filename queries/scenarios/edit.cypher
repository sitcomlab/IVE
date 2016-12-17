MATCH (s:Scenarios)
WHERE ID(s) = toInt({scenario_id})
SET
    s.updated = timestamp(),
    s.s_id = {s_id},
    s.name = {name},
    s.description = {description}
RETURN
    ID(s) AS scenario_id,
    s.created AS created,
    s.updated AS updated,
    s.s_id AS s_id,
    s.name AS name,
    s.description AS description
;
