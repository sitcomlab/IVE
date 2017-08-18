MATCH (v:Videos)-[r:recorded_at]->(l:Locations)
WHERE
    // Relationship
    toLower(r.description) CONTAINS toLower({search_term}) OR
    // Videos
    toLower(v.v_id) CONTAINS toLower({search_term}) OR
    toLower(v.name) CONTAINS toLower({search_term}) OR
    toLower(v.description) CONTAINS toLower({search_term}) OR
    toLower(v.url) CONTAINS toLower({search_term}) OR
    toLower(v.recorded) CONTAINS toLower({search_term}) OR
    // Locations
    toLower(l.l_id) CONTAINS toLower({search_term}) OR
    toLower(l.name) CONTAINS toLower({search_term}) OR
    toLower(l.description) CONTAINS toLower({search_term}) OR
    l.lat CONTAINS toLower({search_term}) OR
    l.lng CONTAINS toLower({search_term})
WITH count(r) AS full_count
MATCH (v:Videos)-[r:recorded_at]->(l:Locations)
WHERE
    // Relationship
    toLower(r.description) CONTAINS toLower({search_term}) OR
    // Videos
    toLower(v.v_id) CONTAINS toLower({search_term}) OR
    toLower(v.name) CONTAINS toLower({search_term}) OR
    toLower(v.description) CONTAINS toLower({search_term}) OR
    toLower(v.url) CONTAINS toLower({search_term}) OR
    toLower(v.recorded) CONTAINS toLower({search_term}) OR
    // Locations
    toLower(l.l_id) CONTAINS toLower({search_term}) OR
    toLower(l.name) CONTAINS toLower({search_term}) OR
    toLower(l.description) CONTAINS toLower({search_term}) OR
    l.lat CONTAINS toLower({search_term}) OR
    l.lng CONTAINS toLower({search_term})
RETURN
    full_count,
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.v_id AS v_id,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded,
    v.thumbnails AS thumbnails,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    r.description AS relationship_description,
    r.preferred AS relationship_preferred,
    ID(l) AS location_id,
    l.created AS location_created,
    l.updated AS location_updated,
    l.l_id AS l_id,
    l.name AS location_name,
    l.description AS location_description,
    l.lat AS location_lat,
    l.lng AS location_lng,
    l.location_type AS location_type
ORDER BY
    CASE WHEN {orderby} = 'created.asc'         THEN r.created END ASC,
    CASE WHEN {orderby} = 'created.desc'        THEN r.created END DESC,
    CASE WHEN {orderby} = 'updated.asc'         THEN r.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc'        THEN r.updated END DESC,
    CASE WHEN {orderby} = 'location_name.asc'   THEN l.name END ASC,
    CASE WHEN {orderby} = 'location_name.desc'  THEN l.name END DESC,
    CASE WHEN {orderby} = 'video_name.asc'      THEN v.name END ASC, l.name ASC,
    CASE WHEN {orderby} = 'video_name.desc'     THEN v.name END DESC, l.name ASC
SKIP toInt({skip})
LIMIT toInt({limit});
