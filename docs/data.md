---
layout: page
permalink: /data/
---

#### Overview
1. [Meta graph](#meta-graph)
    1. [Example graph](#example-graph)
2. [Nodes](#nodes)
    1. [Scenarios](#scenarios)
    2. [Locations](#locations)
    3. [Videos](#videos)
    4. [Overlays](#overlays)
2. [Relationships](#relationships)
    1. [BELONGS_TO](#belongsto)
    2. [CONNECTED_TO](#connectedto)
    3. [HAS_PARENT_LOCATION](#hasparentlocation)
    4. [RECORDED_AT](#recordedat)
    5. [EMBEDDED_IN](#embeddedin)
3. [Available scenarios](#available-scenarios)
    1. [First Scenario](#first-scenario)
    2. [Second Scenario](#second-scenario)
    3. [Third Scenario](#third-scenario)
    4. [Fourth Scenario](#fourth-scenario)

***

# 1. Meta graph

The following graph gives a quick overview about the nodes and edges of the data inside the Neo4j database.

[<img src="{{ site.baseurl }}/images/meta_graph.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)


# 1.1. Example graph

The following graph gives a quick overview about the nodes and edges of the data inside the Neo4j database. It is a simple representation and doesn't contain all required properties:

[<img src="{{ site.baseurl }}/images/graph_overview.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

***

# 2. Nodes

As it can be seen in the previous example graph, there are 4 main nodes (or entities):

## 2.1. Scenarios

###### PROPERTIES

* `scenario_id` (Integer): generated by Neo4j
* `created` (Integer): generated with function `timestamp()`
* `updated` (Integer): generated with function `timestamp()`
* `s_id` (String): import-/export-id, will be automatically generated by `uuid()` inside apiControllers
* `name` (String): name of the scenario
* `description` (String): optional description of the scenario


## 2.2. Locations

###### PROPERTIES

* `location_id` (Integer): generated by Neo4j
* `created` (Integer): generated with function `timestamp()`
* `updated` (Integer): generated with function `timestamp()`
* `l_id` (String): import-/export-id, can be automatically generated by `uuid()` inside apiControllers
* `name` (String): name of the location
* `description` (String):  optional description of the location
* `lat` (Float): Latitude value of the location
* `lng` (Float): Longitude value of the location
* `location_type` (String, options: `indoor`, `outdoor`, `abstract`): type of the location


## 2.3. Videos

###### PROPERTIES

* `video_id` (Integer): generated by Neo4j
* `created` (Integer): generated with function `timestamp()`
* `updated` (Integer): generated with function `timestamp()`
* `v_id` (String): import-/export-id, can be automatically generated by `uuid()` inside apiControllers
* `name` (String): name of the video
* `description` (String): optional description of the video
* `url` (String): url of the video
* `recorded` (String): optional timestamp, when the video was recorded


## 2.4. Overlays

###### PROPERTIES

* `overlay_id`(Integer): generated by Neo4j
* `created` (Integer): generated with function `timestamp()`
* `updated` (Integer): generated with function `timestamp()`
* `o_id` (String): import-/export-id, can be automatically generated by `uuid()` inside apiControllers
* `name` (String): name of the overlay
* `description` (String): optional description of the overlay
* `category` (String, options: `website`, `picture`, `video`): type of the overlay
* `url` (String): url of the overlay

***

# 3. Relationships

## 3.1. BELONGS_TO

<span class="label label-location">i/o:Location</span> *(1)* `-[BELONGS_TO]->` *(1..n)* <span class="label label-scenario">Scenario</span><br>
<span class="label label-video">Video</span> *(1)* `-[BELONGS_TO]->` *(1..n)* <span class="label label-scenario">Scenario</span><br>
<span class="label label-overlay">Overlay</span> *(1)* `-[BELONGS_TO]->` *(1..n)* <span class="label label-scenario">Scenario</span><br>

The relationship `-[BELONGS_TO]->` is used for filtering the data for a specific <span class="label label-scenario">Scenario</span>. All <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span> and <span class="label label-overlay">Overlays</span> can also be used multiple times in different <span class="label label-scenario">Scenarios</span>.


## 3.2. CONNECTED_TO

<span class="label label-location">i/o:Location</span> *(1)* `-[CONNECTED_TO]->` *(1..n)* <span class="label label-location">i/o:Location</span><br>

This relationship builds a path between two <span class="label label-location">i/o:Locations</span>, which is responsible for the main navigation. If your

###### PROPERTIES

* `i_id` (String): optional intent-ID to reference to all related intents inside a Postgres table (only required for for the [voice-control-extension]({{ site.baseurl }}/expansion/#41-voice-control-system))


## 3.3. HAS_PARENT_LOCATION

<span class="label label-location">i/o:Location</span> *(1)* `-[HAS_PARENT_LOCATION]->` *(1)* <span class="label label-abstract-location">abstract:Location</span><br>

The parent location approach was introduced to the graph to provide a better map representation of many locations. Clustering might be an option, but especially for <span class="label label-location">indoor:Locations</span> the map markers can be very densed. To avoid that, the map makers can generated from an parent location.

It is easy to connect <span class="label label-location">outdoor:Locations</span> with a `-[CONNECTED_TO]->` relationship:

[<img src="{{ site.baseurl }}/images/1_outdoor.png" alt="map marker outdoor" class="picture" />]({{ site.baseurl }}/)

But when it comes to <span class="label label-location">indoor:Locations</span>, it is difficult to click them on a map, because the coordinates are very close to each other. The following graph demonstrates the problem with <span class="label label-location">indoor:Locations</span> of the institute building:

[<img src="{{ site.baseurl }}/images/2_fail.png" alt="map marker fail" class="picture" />]({{ site.baseurl }}/)

The solution is to aggregate the <span class="label label-location">indoor:Locations</span> to a single marker representation:

[<img src="{{ site.baseurl }}/images/3_indoor.png" alt="map marker indoor" class="picture" />]({{ site.baseurl }}/)

Therefore each <span class="label label-location">indoor:Location</span> has to be connected with the relationship `-[HAS_PARENT_LOCATION]->` to a so called <span class="label label-abstract-location">abstract:Location</span>.
An <span class="label label-abstract-location">abstract:Location</span> is a representative location to provide the coordinates for the marker, which means all related <span class="label label-location">indoor:Locations</span> can have empty coordinates (`lng: 0.0, lat: 0.0` or `lng: null, lat: null`).
It is highly recommended to connect all <span class="label label-location">indoor:Locations</span> to an <span class="label label-abstract-location">abstract:Location</span>, so that the transition between outdoor and indoor comes clear and is well defined for later.

For specifying a <span class="label label-location">Location</span> use the `location_type` property, which can have the following values:
* `indoor`
* `outdoor`
* `abstract`

The parent location approach also allows the normal usage of `-[CONNECTED_TO]->` relationships between
<span class="label label-location">indoor:Locations</span> as well as <span class="label label-location">outdoor:Locations</span>. The following example shows a graph of the institute building and the relationships between the <span class="label label-location">Locations</span>:

[<img src="{{ site.baseurl }}/images/parent_location.png" alt="main relationships" class="picture" />]({{ site.baseurl }}/)

## 3.4. RECORDED_AT

<span class="label label-video">Video</span> *(1)* `-[RECORDED_AT]->` *(1)* <span class="label label-location">i/o:Location</span><br>

This relationship is used to attach one (or more) video(s) to a location, where they have been recorded.

###### PROPERTIES

* `preferred` (Boolean): the default value is `true` and becomes necessary, if you have multiple videos, which were recorded at two different times (for example: one at daylight, one at nightlight). To specify, which video should be played first in the IVE, set this property to `true` for your starting video and for all other videos to `false`.


## 3.5. EMBEDDED_IN

<span class="label label-overlay">Overlay</span> *(1)* `-[EMBEDDED_IN]->` *(1..n)* <span class="label label-video">Video</span><br>

This relationship is used to embed an overlay into a video. Its spatial orientation and position inside the video differs from video to video. Therefore these parameters are stored inside this relationship, so that an overlay can be used multiple times.

###### PROPERTIES

* `w` (Float): width of the overlay
* `h` (Float): height of the overlay
* `d` (Float):  distortion of the overlay
* `x` (Float): translation of the overlay on the x-axis
* `y` (Float): translation of the overlay on the y-axis
* `z` (Float): translation of the overlay on the z-axis
* `rx` (Float): rotation of the overlay on the x-axis
* `ry` (Float): rotationof the overlay on the y-axis
* `rz` (Float): rotationof the overlay on the z-axis
* `display` (Boolean): the default value is `true`. If you want to hide the overlay by default, set the value to `false`, so when you enter a location in the IVE the overlay is hidden and can be enabled manually.

***

# 4. Available scenarios

If you want to test the IVE and don't want to create own data, you can [import]({{ site.baseurl }}/import/) the data of the following scenarios. All required data are stored in CSV files in the folder `data/*`. Use the [setup-script]({{ site.baseurl }}/install/#automatic-import-recommended) to automatically import all files.

## 4.1. First scenario

[<img src="{{ site.baseurl }}/images/scenario_1.png" alt="1st scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains the area of Münsters city center as well as an overlay.

```sql
MATCH (n)-[r:belongs_to]->(s:Scenarios) WHERE s.s_id='s_01' RETURN n;
```

## 4.2. Second scenario

[<img src="{{ site.baseurl }}/images/scenario_2.png" alt="2nd scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains the area around and from Münsters main station as well as two overlays.

```sql
MATCH (n)-[r:belongs_to]->(s:Scenarios) WHERE s.s_id='s_02' RETURN n;
```

## 4.3. Third scenario

[<img src="{{ site.baseurl }}/images/scenario_3.png" alt="3rd scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains the GEO-1 building and was used in a bachelor thesis. The thesis focused on a voice control system for the IVE.

```sql
MATCH (n)-[r:belongs_to]->(s:Scenarios) WHERE s.s_id='s_03' RETURN n;
```

## 4.4. Fourth scenario

[<img src="{{ site.baseurl }}/images/scenario_4.png" alt="4th scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains in much more detailed way the second floor of the GEO-1 building, but the relationships of this scenario have not been finished until yet.

```sql
MATCH (n)-[r:belongs_to]->(s:Scenarios) WHERE s.s_id='s_04' RETURN n;
```
