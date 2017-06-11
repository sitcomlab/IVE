MATCH (l:Locations)
WHERE
	toLower(l.l_id) CONTAINS toLower({search_term}) OR
	toLower(l.name) CONTAINS toLower({search_term}) OR
	toLower(l.description) CONTAINS toLower({search_term}) OR
	l.lat CONTAINS toLower({search_term}) OR
	l.lng CONTAINS toLower({search_term})
WITH count(*) AS full_count
MATCH (l:Locations)
WHERE
	toLower(l.l_id) CONTAINS toLower({search_term}) OR
	toLower(l.name) CONTAINS toLower({search_term}) OR
	toLower(l.description) CONTAINS toLower({search_term}) OR
	l.lat CONTAINS toLower({search_term}) OR
	l.lng CONTAINS toLower({search_term})
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
ORDER BY l.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
