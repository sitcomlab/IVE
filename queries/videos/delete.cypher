MATCH (v:Videos)
WHERE ID(v) = toInt({video_id})
DETACH DELETE v;
