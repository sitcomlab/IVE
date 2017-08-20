MATCH (l:Locations)-[r:belongs_to]->(s:Scenarios)
WHERE
    // Locations
	toLower(l.location_uuid) CONTAINS toLower({search_term}) OR
	toLower(l.name) CONTAINS toLower({search_term}) OR
	toLower(l.description) CONTAINS toLower({search_term}) OR
	l.lat CONTAINS toLower({search_term}) OR
	l.lng CONTAINS toLower({search_term}) OR
    // Scenarios
    toLower(s.scenario_uuid) CONTAINS toLower({search_term}) OR
    toLower(s.name) CONTAINS toLower({search_term}) OR
    toLower(s.description) CONTAINS toLower({search_term})
WITH count(r) AS full_count
MATCH (l:Locations)-[r:belongs_to]->(s:Scenarios)
WHERE
    // Locations
	toLower(l.location_uuid) CONTAINS toLower({search_term}) OR
	toLower(l.name) CONTAINS toLower({search_term}) OR
	toLower(l.description) CONTAINS toLower({search_term}) OR
	l.lat CONTAINS toLower({search_term}) OR
	l.lng CONTAINS toLower({search_term}) OR
    // Scenarios
    toLower(s.scenario_uuid) CONTAINS toLower({search_term}) OR
    toLower(s.name) CONTAINS toLower({search_term}) OR
    toLower(s.description) CONTAINS toLower({search_term})
RETURN
    full_count,
    ID(l) AS location_id,
    l.created AS location_created,
    l.updated AS location_updated,
    l.location_uuid AS location_uuid,
    l.name AS location_name,
    l.description AS location_description,
    l.lat AS location_lat,
    l.lng AS location_lng,
    l.location_type AS location_type,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.scenario_uuid AS scenario_uuid,
    s.name AS scenario_name,
    s.description AS scenario_description
ORDER BY
    CASE WHEN {orderby} = 'created.asc'         THEN r.created END ASC,
    CASE WHEN {orderby} = 'created.desc'        THEN r.created END DESC,
    CASE WHEN {orderby} = 'updated.asc'         THEN r.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc'        THEN r.updated END DESC,
    CASE WHEN {orderby} = 'location_name.asc'   THEN l.name END ASC,
    CASE WHEN {orderby} = 'location_name.desc'  THEN l.name END DESC,
    CASE WHEN {orderby} = 'scenario_name.asc'   THEN s.name END ASC, l.name ASC,
    CASE WHEN {orderby} = 'scenario_name.desc'  THEN s.name END DESC, l.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
