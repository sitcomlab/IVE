CREATE (v:Videos {
    created: timestamp(),
    updated: timestamp(),
    video_uuid: {video_uuid},
    name: {name},
    description: {description},
    url: {url},
    recorded: {recorded},
    comment: {comment},
    rating: {rating},
    thumbnails: {thumbnails}
}) RETURN
    ID(v) AS video_id,
    v.created AS created,
    v.updated AS updated,
    v.video_uuid AS video_uuid,
    v.name AS name,
    v.description AS description,
    v.url AS url,
    v.recorded AS recorded,
    v.thumbnails AS thumbnails,
    v.rating AS rating,
    v.comment AS comment
;
