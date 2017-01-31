MATCH (start)-[relationship]->(end)
WHERE ID(relationship) = toInt({relationship_id})
DELETE relationship;
