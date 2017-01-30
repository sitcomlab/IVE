MATCH (o:Overlays)-[r:belongs_to]->(s:Scenarios)
RETURN
    ID(o) AS overlay_id,
    o.created AS overlay_created,
    o.updated AS overlay_updated,
    o.o_id AS o_id,
    o.name AS overlay_name,
    o.description AS overlay_description,
    o.category AS overlay_category,
    o.url AS overlay_url,
    ID(r) AS relationship_id,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.s_id AS s_id,
    s.name AS scenario_name,
    s.description AS scenario_description
;
