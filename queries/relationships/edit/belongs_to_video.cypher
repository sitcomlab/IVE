MATCH (v:Videos)-[r:belongs_to]->(s:Scenarios)
WHERE ID(r)=toInt({relationship_id})
SET
    r.updated = timestamp()
RETURN
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.video_uuid AS video_uuid,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded,
    v.thumbnails AS thumbnails,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.scenario_uuid AS scenario_uuid,
    s.name AS scenario_name,
    s.description AS scenario_description
;
