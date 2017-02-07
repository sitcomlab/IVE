---
layout: page
permalink: /data/
---


### Overview
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

# 1. Example graph

The following graph gives a quick overview about the nodes and edges of the IVE inside the Neo4j database. It is a simple representation and doesn't contain all required properties (and was created with the [arrow tool](http://www.apcjones.com/arrows/), which is made by [apcjones](https://github.com/apcj)):

[<img src="{{ site.baseurl }}/images/graph_overview.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

***

# 2. Nodes

As it can be seen in the previous example graph, there are 4 main nodes (or entities):

## 2.1. Scenarios

###### PROPERTIES

* `scenario_id`:
* `s_id`:
* `created`:
* `updated`:
* `name`:
* `description`:

###### EXAMPLE

```json

```

## 2.2. Locations
PROPERTIES


## 2.3. Videos
PROPERTIES


## 2.4. Overlays
PROPERTIES

***

# 3. Relationships

## 3.1. BELONGS_TO

<span class="label label-location">i/o:Location</span> *(1)* `-[BELONGS_TO]->` *(1..n)* <span class="label label-scenario">Scenario</span><br>
<span class="label label-video">Video</span> *(1)* `-[BELONGS_TO]->` *(1..n)* <span class="label label-scenario">Scenario</span><br>
<span class="label label-overlay">Overlay</span> *(1)* `-[BELONGS_TO]->` *(1..n)* <span class="label label-scenario">Scenario</span><br>

The relationship `-[BELONGS_TO]->` is used for filtering the data for a specific <span class="label label-scenario">Scenario</span>. All <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span> and <span class="label label-overlay">Overlays</span> can also be used multiple times in different <span class="label label-scenario">Scenarios</span>.


## 3.2. CONNECTED_TO

<span class="label label-location">i/o:Location</span> *(1)* `-[CONNECTED_TO]->` *(1..n)* <span class="label label-location">i/o:Location</span><br>

This relationship builds the navigation between two <span class="label label-location">i/o:Locations</span>.


### 3.2.1.


### 3.2.2.


## 3.3. HAS_PARENT_LOCATION

<span class="label label-location">i/o:Location</span> *(1)* `-[HAS_PARENT_LOCATION]->` *(1)* <span class="label label-abstract-location">abstract:Location</span><br>

The parent location approach was introduced to the graph to provide a better map representation of many locations. Clustering might be an option, but especially for <span class="label label-location">indoor:Locations</span> the map markers can be very densed. To avoid that, the map makers can generated from an parent location.

It is easy to connect <span class="label label-location">outdoor:Locations</span> with a `-[CONNECTED_TO]->` relationship:

[<img src="{{ site.baseurl }}/images/1_outdoor.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

But when it comes to <span class="label label-location">indoor:Locations</span>, it is difficult to click them on a map, because the coordinates are very close to each other. The following graph demonstrates the problem with <span class="label label-location">indoor:Locations</span> of the institute building:

[<img src="{{ site.baseurl }}/images/2_fail.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

The solution is to aggregate the <span class="label label-location">indoor:Locations</span> to a single marker representation:

[<img src="{{ site.baseurl }}/images/3_indoor.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

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

This relationship is used to attach one (or more) video(s) to a location, where they have been recorded. The property `preferred: {value}` with the options: `true`, `false` and the default value `true`, becomes necessary if you have multiple videos, which were recorded at two different times (for example: one at daylight, one at nightlight). To specify, which video should be played first in the IVE set the property `preferred` to `true` for your starting video and for all other videos to `false`.

## 3.5. EMBEDDED_IN

<span class="label label-overlay">Overlay</span> *(1)* `-[EMBEDDED_IN]->` *(1..n)* <span class="label label-video">Video</span><br>

*** 

## 1.1. First scenario

[<img src="{{ site.baseurl }}/images/scenario_1.png" alt="1st scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains the area of Münsters city center as well as an overlay.

## 1.2. Second scenario

[<img src="{{ site.baseurl }}/images/scenario_2.png" alt="2nd scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains the area around and from Münsters main station as well as two overlays.

## 1.3. Third scenario

[<img src="{{ site.baseurl }}/images/scenario_3.png" alt="3rd scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains the GEO-1 building and was used in a bachelor thesis. The thesis focused on a voice control system for the IVE.

## 1.4. Fourth scenario

[<img src="{{ site.baseurl }}/images/scenario_4.png" alt="4th scenario" class="picture" />]({{ site.baseurl }}/)

This scenario contains in much more detailed way the second floor of the GEO-1 building, but the relationships of this scenario have not been finished until yet.
