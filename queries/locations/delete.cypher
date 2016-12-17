MATCH (l:Locations)
WHERE ID(l) = toInt({location_id})
DETACH DELETE l;
