CREATE (scenario:Scenarios {
    s_id: {s_id},
    name: {name},
    description: {description},
    created: timestamp(),
    updated: timestamp()
}) RETURN
    ID(scenario) AS scenario_id,
    scenario.s_id AS s_id,
    scenario.name AS name,
    scenario.description AS description,
    scenario.created AS created,
    scenario.updated AS updated
;
