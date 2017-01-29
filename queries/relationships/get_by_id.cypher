MATCH (start)-[relationship]->(end)
WHERE ID(relationship) = toInt({relationship_id})
RETURN start, relationship, end;
