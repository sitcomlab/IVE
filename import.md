---
layout: page
permalink: /import/
---

#### Overview
1. [Options](#options)
    1. [CREATOR](#CREATOR)
    2. [CSV files](#csv-files)
    3. [REST-API](#rest-api)
    4. [Cypher queries](#cypher-queries)
        1. [Create a new scenario](#create-a-new-scenario)
        2. [Create a new location](#create-a-new-location)
        3. [Create a new video](#create-a-new-video)
        4. [Create a new overlay](#create-a-new-overlay)
        5. [Create a new BELONGS_TO relationship](#create-a-new--belongs_to--relationship)
            1. [For a location](#for-a-location)
            2. [For a video](#for-a-video)
            3. [For an overlay](#for-an-overlay)
        6. [Create a new CONNECTED_TO relationship](#create-a-new--connected_to--relationship)
        7. [Create a new HAS_PARENT_LOCATION relationship](#create-a-new--has_parent_location--relationship)
        8. [Create a new RECORDED_AT relationship](#create-a-new--recorded_at--relationship)
        9. [Create a new EMBEDDED_IN relationship](#create-a-new--embedded_in--relationship)

***

# 1. Options

The IVE provides different import functionalities to get your data into Neo4j. The 4 options can be seen in the following picture:

[<img src="{{ site.baseurl }}/images/import.svg" alt="import options" class="picture" />]({{ site.baseurl }}/)

## 1.1. CREATOR (RECOMMENDED)
The CREATOR is the recommended way to create new entries or manage you existing entries.

## 1.2. CSV files
For sharing a graph, the CSV format is the best. Therefore the setup-script can be used to import the example graph of the IVE. It contains several scenarios with locations, videos, overlays and their relationships. Beside the automatic import of the setup-script, it is possible to create own CSV files and upload them by using the cypher-commands of Neo4j. You need to specify the import-path for Neo4j, please checkout the instructions in the installation guide to get more information about it. All necessary cypher commands can be found in the folder `/queries/setup/*`.

## 1.3. REST-API
The CREATOR, as well as the VIEWER and REMOTE CONTROL, are using internally an REST-API to request and retrieve the data. So the REST-API is an alternative way to creating new entries or managing existing ones, but most requests need a JSON-webtoken for authentication, so you need to request a token first, before you can use all API endpoints. Submit a POST-request to the endpoint `/login` to authenticate:

```json
{
    "username": "admin",
    "password": "admin"
}
```

It is not recommended to use it in this way, because the CREATOR provides a much better user-interface, where you can easily create new entries. But if you plan to create a new application to create or import data, the REST-API is the perfect way for that.

## 1.4. Cypher queries
This option is on the database-level and a direct way to your data. It is also not recommended, because the CREATOR provides a much better user-interface, where you can easily create new entries or edit existing ones. But if you want to validate your data with the help of a full graph visualization, the Neo4j browser can help you. Open in your browser the address `localhost:7474` to access the graphical user interface with the built in neo4j-shell. (On a command-line-interface, if you only want the neo4j-shell, type in the command `neo4j-shell`, more information can be found here: [http://neo4j.com/docs/snapshot/shell-starting.html](http://neo4j.com/docs/snapshot/shell-starting.html)).
For inserting your data manually, please find the cypher queries below. If you want to see your full graph, type in the following cypher query:

```sql
MATCH (n) RETURN (n);
```

If you want to see all queries, which are used in the IVE, checkout the repository folder `/queries/*`.
If you want to use the setup-script, please checkout the [installation guide about the automatic import]({{ site.baseurl }}/install/#automatic-import-recommended).

### 1.4.1. Create a new <span class="label label-scenario">Scenario</span>

```sql
CREATE (s:Scenarios {
    created: timestamp(),
    updated: timestamp(),
    s_id: {s_id},
    name: {name},
    description: {description}
}) RETURN
    ID(s) AS scenario_id,
    s.created AS created,
    s.updated AS updated,
    s.s_id AS s_id,
    s.name AS name,
    s.description AS description
;
```

### 1.4.2. Create a new <span class="label label-location">Location</span>

```sql
CREATE (l:Locations {
    created: timestamp(),
    updated: timestamp(),
    l_id: {l_id},
    name: {name},
    description: {description},
    lat: {lat},
    lng: {lng},
    location_type: {location_type}
}) RETURN
    ID(l) AS location_id,
    l.created AS created,
    l.updated AS updated,
    l.l_id AS l_id,
    l.name AS name,
    l.description AS description,
    l.lat AS lat,
    l.lng AS lng,
    l.location_type AS location_type
;
```

### 1.4.3. Create a new <span class="label label-video">Video</span>

```sql
CREATE (v:Videos {
    created: timestamp(),
    updated: timestamp(),
    v_id: {v_id},
    name: {name},
    description: {description},
    url: {url},
    recorded: {recorded}
}) RETURN
    ID(v) AS video_id,
    v.created AS created,
    v.updated AS updated,
    v.v_id AS v_id,
    v.name AS name,
    v.description AS description,
    v.url AS url,
    v.recorded AS recorded
;
```

### 1.4.4. Create a new <span class="label label-overlay">Overlay</span>

```sql
CREATE (o:Overlays {
    created: timestamp(),
    updated: timestamp(),
    o_id: {o_id},
    name: {name},
    description: {description},
    category: {category},
    url: {url}
}) RETURN
    ID(o) AS overlay_id,
    o.created AS created,
    o.updated AS updated,
    o.o_id AS o_id,
    o.name AS name,
    o.description AS description,
    o.category AS category,
    o.url AS url
;
```

### 1.4.5. Create a new `-[BELONGS_TO]->` <span class="label label-default">Relationship</span>

#### 1.4.5.1. For a Location

```sql
MATCH (l:Locations) WHERE ID(l) = toInt({location_id})
MATCH (s:Scenarios) WHERE ID(s) = toInt({scenario_id})
CREATE (l)-[r:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(s)
RETURN
    ID(l) AS location_id,
    l.created AS location_created,
    l.updated AS location_updated,
    l.l_id AS l_id,
    l.name AS location_name,
    l.description AS location_description,
    l.lat AS location_lat,
    l.lng AS location_lng,
    l.location_type AS location_type,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.s_id AS s_id,
    s.name AS scenario_name,
    s.description AS scenario_description
;
```

#### 1.4.5.2. For a video

```sql
MATCH (v:Videos) WHERE ID(v) = toInt({video_id})
MATCH (s:Scenarios) WHERE ID(s) = toInt({scenario_id})
CREATE (v)-[r:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(s)
RETURN
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.v_id AS v_id,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.s_id AS s_id,
    s.name AS scenario_name,
    s.description AS scenario_description
;
```

#### 1.4.5.3. For an overlay

```sql
MATCH (o:Overlays) WHERE ID(o) = toInt({overlay_id})
MATCH (s:Scenarios) WHERE ID(s) = toInt({scenario_id})
CREATE (o)-[r:belongs_to {
    created: timestamp(),
    updated: timestamp()
}]->(s)
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
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(s) AS scenario_id,
    s.created AS scenario_created,
    s.updated AS scenario_updated,
    s.s_id AS s_id,
    s.name AS scenario_name,
    s.description AS scenario_description
;
```

### 1.4.6. Create a new `-[CONNECTED_TO]->` <span class="label label-default">Relationship</span>

```sql
MATCH (start:Locations) WHERE ID(start) = toInt({start_location_id})
MATCH (end:Locations) WHERE ID(end) = toInt({end_location_id})
CREATE (start)-[r:connected_to {
    created: timestamp(),
    updated: timestamp()
}]->(end)
RETURN
    ID(start) AS start_location_id,
    start.created AS start_location_created,
    start.updated AS start_location_updated,
    start.l_id AS start_l_id,
    start.name AS start_location_name,
    start.description AS start_location_description,
    start.lat AS start_location_lat,
    start.lng AS start_location_lng,
    start.location_type AS start_location_type,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(end) AS end_location_id,
    end.created AS end_location_created,
    end.updated AS end_location_updated,
    end.l_id AS end_l_id,
    end.name AS end_location_name,
    end.description AS end_location_description,
    end.lat AS end_location_lat,
    end.lng AS end_location_lng,
    end.location_type AS end_location_type
;
```

### 1.4.7. Create a new `-[HAS_PARENT_LOCATION]->` <span class="label label-default">Relationship</span>

```sql
MATCH (child:Locations) WHERE ID(child) = toInt({child_location_id})
MATCH (parent:Locations) WHERE ID(parent) = toInt({parent_scenario_id})
CREATE (child)-[r:has_parent_location {
    created: timestamp(),
    updated: timestamp()
}]->(parent)
RETURN
    ID(child) AS child_location_id,
    child.created AS child_location_created,
    child.updated AS child_location_updated,
    child.l_id AS child_l_id,
    child.name AS child_location_name,
    child.description AS child_location_description,
    child.lat AS child_location_lat,
    child.lng AS child_location_lng,
    child.location_type AS child_location_type,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    ID(parent) AS parent_location_id,
    parent.created AS parent_location_created,
    parent.updated AS parent_location_updated,
    parent.l_id AS parent_l_id,
    parent.name AS parent_location_name,
    parent.description AS parent_location_description,
    parent.lat AS parent_location_lat,
    parent.lng AS parent_location_lng,
    parent.location_type AS parent_location_type
;
```

### 1.4.8. Create a new `-[RECORDED_AT]->` <span class="label label-default">Relationship</span>

```sql
MATCH (v:Videos) WHERE ID(v) = toInt({video_id})
MATCH (l:Locations) WHERE ID(l) = toInt({location_id})
CREATE (v)-[r:recorded_at {
    created: timestamp(),
    updated: timestamp(),
    preferred: {preferred}
}]->(l)
RETURN
    ID(v) AS video_id,
    v.created AS video_created,
    v.updated AS video_updated,
    v.v_id AS v_id,
    v.name AS video_name,
    v.description AS video_description,
    v.url AS video_url,
    v.recorded AS video_recorded,
    ID(r) AS relationship_id,
    r.created AS relationship_created,
    r.updated AS relationship_updated,
    r.preferred AS relationship_preferred,
    ID(l) AS location_id,
    l.created AS location_created,
    l.updated AS location_updated,
    l.l_id AS l_id,
    l.name AS location_name,
    l.description AS location_description,
    l.lat AS location_lat,
    l.lng AS location_lng,
    l.location_type AS location_type
;
```

### 1.4.9. Create a new `-[EMBEDDED_IN]->` <span class="label label-default">Relationship</span>

```sql
MATCH (o:Overlays) WHERE ID(o) = toInt({overlay_id})
MATCH (v:Videos) WHERE ID(v) = toInt({video_id})
CREATE (o)-[r:embedded_in {
    created: timestamp(),
    updated: timestamp(),
    w: {w},
    h: {h},
    d: {d},
    x: {x},
    y: {y},
    z: {z},
    rx: {rx},
    ry: {ry},
    rz: {rz},
    display: {display}
}]->(v)
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
;
```
