MATCH (l:Locations)-[r:belongs_to]->(s:Scenarios)
WHERE
		l.location_type = {location_type}
	AND
		ID(s)= toInt({scenario_id})
	AND (
		toLower(l.l_id) CONTAINS toLower({search_term}) OR
		toLower(l.name) CONTAINS toLower({search_term}) OR
		toLower(l.description) CONTAINS toLower({search_term}) OR
		l.lat CONTAINS toLower({search_term}) OR
		l.lng CONTAINS toLower({search_term})
	)
WITH count(*) AS full_count
MATCH (l:Locations)-[r:belongs_to]->(s:Scenarios)
WHERE
		l.location_type = {location_type}
	AND
		ID(s)= toInt({scenario_id})
	AND (
		toLower(l.l_id) CONTAINS toLower({search_term}) OR
		toLower(l.name) CONTAINS toLower({search_term}) OR
		toLower(l.description) CONTAINS toLower({search_term}) OR
		l.lat CONTAINS toLower({search_term}) OR
		l.lng CONTAINS toLower({search_term})
	)
RETURN
    full_count,
    ID(l) AS location_id,
    l.created AS created,
    l.updated AS updated,
    l.l_id AS l_id,
    l.name AS name,
    l.description AS description,
    l.lat AS lat,
    l.lng AS lng,
    l.location_type AS location_type
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN l.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN l.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN l.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN l.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN l.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN l.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
