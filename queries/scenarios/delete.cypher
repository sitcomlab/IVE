MATCH (s:Scenarios)
WHERE ID(s) = toInt({scenario_id})
DETACH DELETE s;
