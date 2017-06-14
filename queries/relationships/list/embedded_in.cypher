MATCH (o:Overlays)-[r:embedded_in]->(v:Videos)
WITH count(r) AS full_count
MATCH (o:Overlays)-[r:embedded_in]->(v:Videos)
RETURN
    full_count,
    ID(o) AS overlay_id,
    o.created AS overlay_created,
    o.updated AS overlay_updated,
    o.o_id AS o_id,
    o.name AS overlay_name,
    o.description AS overlay_description,
    o.category AS overlay_category,
    o.url AS overlay_url,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    r.w AS relationship_w,
    r.h AS relationship_h,
    r.d AS relationship_d,
    r.x AS relationship_x,
    r.y AS relationship_y,
    r.z AS relationship_z,
    r.rx AS relationship_rx,
    r.ry AS relationship_ry,
    r.rz AS relationship_rz,
    r.display AS relationship_display,
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.v_id AS v_id,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded
ORDER BY
    CASE WHEN {orderby} = 'created.asc' THEN r.created END ASC,
    CASE WHEN {orderby} = 'created.desc' THEN r.created END DESC,
    CASE WHEN {orderby} = 'updated.asc' THEN r.updated END ASC,
    CASE WHEN {orderby} = 'updated.desc' THEN r.updated END DESC,
    CASE WHEN {orderby} = 'name.asc' THEN o.name END ASC,
    CASE WHEN {orderby} = 'name.desc' THEN o.name END DESC
SKIP toInt({skip})
LIMIT toInt({limit});
