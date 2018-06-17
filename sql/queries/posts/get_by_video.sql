SELECT
    post.post_id,
    post.post_uuid,
    post.created,
    post.updated,
    post.comment,
    post.rating,
    post.video_id
FROM Posts post
WHERE post.video_id = $video_id
ORDER BY 'created.desc' THEN post.created END DESC;
