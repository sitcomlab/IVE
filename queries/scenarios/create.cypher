CREATE (s:Scenarios {
    created: timestamp(),
    updated: timestamp(),
    scenario_uuid: {scenario_uuid},
    name: {name},
    description: {description}
}) RETURN
    ID(s) AS scenario_id,
    s.created AS created,
    s.updated AS updated,
    s.scenario_uuid AS scenario_uuid,
    s.name AS name,
    s.description AS description
;
