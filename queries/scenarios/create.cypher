CREATE (s:Scenarios {
    created: timestamp(),
    updated: timestamp(),
    s_id: {s_id},
    name: {name},
    description: {description}
}) RETURN
    ID(s) AS scenario_id,
    s.created AS created,
    s.updated AS updated,
    s.s_id AS s_id,
    s.name AS name,
    s.description AS description,
;
