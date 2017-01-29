MATCH (v:Videos)-[r:recorded_at]->(l:Locations)
RETURN
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.v_id AS v_id,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded,
    ID(r) AS relationship_id,
    ID(l) AS location_id,
    l.created AS location_created,
    l.updated AS location_updated,
    l.l_id AS l_id,
    l.name AS location_name,
    l.description AS location_description,
    l.lat AS location_lat,
    l.lng AS location_lng,
    l.location_type AS location_type
;
