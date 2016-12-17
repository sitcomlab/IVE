CREATE (s:Scenarios {
    s_id: {s_id},
    name: {name},
    description: {description},
    created: timestamp(),
    updated: timestamp()
}) RETURN
    ID(s) AS scenario_id,
    s.s_id AS s_id,
    s.name AS name,
    s.description AS description,
    s.created AS created,
    s.updated AS updated
;
