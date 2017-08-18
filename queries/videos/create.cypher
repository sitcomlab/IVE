CREATE (v:Videos {
    created: timestamp(),
    updated: timestamp(),
    v_id: {v_id},
    name: {name},
    description: {description},
    url: {url},
    recorded: {recorded},
    thumbnails: {thumbnails}
}) RETURN
    ID(v) AS video_id,
    v.created AS created,
    v.updated AS updated,
    v.v_id AS v_id,
    v.name AS name,
    v.description AS description,
    v.url AS url,
    v.recorded AS recorded
    v.thumbnails AS thumbnails
;
