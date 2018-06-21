SELECT
    avg(post.rating) AS average_rating
FROM Posts post
WHERE post.video_id = $video_id;
