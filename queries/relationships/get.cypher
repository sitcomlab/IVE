MATCH (start)-[relationship]->(end)
WHERE ID(relationship) = toInt({relationship_id})
RETURN ID(relationship) AS relationship_id;
