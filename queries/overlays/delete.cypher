MATCH (o:Overlays)
WHERE ID(o) = toInt({overlay_id})
DETACH DELETE o;
