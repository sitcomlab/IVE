MATCH (v:Videos)
WHERE ID(v) = toInt({video_id})
SET
    v.updated = timestamp(),
    v.video_uuid = {video_uuid},
    v.name = {name},
    v.description = {description},
    v.url = {url},
    v.recorded = {recorded},
    v.thumbnails = {thumbnails}
RETURN
    ID(v) AS video_id,
    v.created AS created,
    v.updated AS updated,
    v.video_uuid AS video_uuid,
    v.name AS name,
    v.description AS description,
    v.url AS url,
    v.recorded AS recorded,
    v.thumbnails AS thumbnails
;
