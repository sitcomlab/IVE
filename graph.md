---
layout: page
permalink: /graph/
---


### Overview
1. [Example graph](#example-graph)
2. [Relationships](#relationships)
3. [Parent location approach](#parent-location-approach)
4. [Weighting for relationships](#weighting-for-relationships)
5. [Voice control](#voice-control)
6. [Filtering by Scenario](#filtering-by-scenario)

***


# 1. Example graph

The following graph gives a quick overview about the nodes and edges of the IVE inside the Neo4j database. It is a simple representation and doesn't contain all required properties (and was created with this [tool](http://www.apcjones.com/arrows/)):

[<img src="{{ site.baseurl }}/images/graph_overview.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)



# 2. Relationships

* <span class="label label-location">i/o:Location</span> *(1)* `-[:belongs_to]->` *(1..n)* <span class="label label-scenario">Scenario</span>
* <span class="label label-location">i/o:Location</span> *(1)* `-[:connected_to]->` *(1..n)* <span class="label label-location">i/o:Location</span>
* <span class="label label-location">i/o:Location</span> *(1)* `-[:parent_location]->` *(1)* <span class="label label-abstract-location">abstract:Location</span>
* <span class="label label-video">Video</span> *(1)* `-[:belongs_to]->` *(1..n)* <span class="label label-scenario">Scenario</span>
* <span class="label label-video">Video</span> *(1)* `-[:recorded_at]->` *(1)* <span class="label label-location">i/o:Location</span>
* <span class="label label-overlay">Overlay</span> *(1)* `-[:belongs_to]->` *(1..n)* <span class="label label-scenario">Scenario</span>
* <span class="label label-overlay">Overlay</span> *(1)* `-[:embedded_in]->` *(1..n)* <span class="label label-video">Video</span>


# 3. Parent location approach

It is easy to connect <span class="label label-location">outdoor:Locations</span> with a `-[:connected_to]->` relationship:

[<img src="{{ site.baseurl }}/images/1_outdoor.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

But when it comes to <span class="label label-location">indoor:Locations</span>, it is difficult to click them on a map, because the coordinates are very close to each other. The following graph demonstrates the problem with <span class="label label-location">indoor:Locations</span> of the institute building:

[<img src="{{ site.baseurl }}/images/2_fail.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

The solution is to aggregate the <span class="label label-location">indoor:Locations</span> to a single marker representation:

[<img src="{{ site.baseurl }}/images/3_indoor.png" alt="graph overview" class="picture" />]({{ site.baseurl }}/)

Therefore each <span class="label label-location">indoor:Location</span> has to be connected with the relationship `-[:parent_location]->` to a so called <span class="label label-abstract-location">abstract:Location</span>.
An <span class="label label-abstract-location">abstract:Location</span> is a representative location to provide the coordinates for the marker, which means all related <span class="label label-location">indoor:Locations</span> can have empty coordinates (`lng: 0.0, lat: 0.0` or `lng: null, lat: null`).
It is highly recommended to connect all <span class="label label-location">indoor:Locations</span> to an <span class="label label-abstract-location">abstract:Location</span>, so that the transition between outdoor and indoor comes clear and is well defined for later.

For specifying a <span class="label label-location">Location</span> use the `location_type` property, which can have the following values:
* `indoor`
* `outdoor`
* `abstract`

The parent location approach also allows the normal usage of `-[:connected_to]->` relationships between
<span class="label label-location">indoor:Locations</span> as well as <span class="label label-location">outdoor:Locations</span>. The following example shows a graph of the institute building and the relationships between the <span class="label label-location">Locations</span>:

[<img src="{{ site.baseurl }}/images/parent_location.png" alt="main relationships" class="picture" />]({{ site.baseurl }}/)


# 4. Weighting for relationships

All relationships can be weighted by default. In the previous graph the property `weights` in the `-[:connected_to]->` relationship has the value `1.0`. But this property could also be used or renamed to `travel-minutes`, which could  then contain the minutes to go from one <span class="label label-location">Location</span> to another. If you need weights in your application, all properties inside the relationships are fully customizable. Another example is the `-[:embedded_in]->` relationship, between an <span class="label label-overlay">Overlay</span> and a <span class="label label-video">Video</span>. All settings of the translation, rotation and scaling are saved inside the `-[:embedded_in]->` relationship, so a <span class="label label-overlay">Overlay</span> can used multiple times in different positions or different <span class="label label-video">Videos</span>, without duplicating an <span class="label label-overlay">Overlay</span> object.

# 5. Voice control system

The property `intents:["go_left", "enter_room"]` of the `-[:connected_to]->` relationship is used in the voice control system. If a given voice command was identified by an external voice recognition system, the system responses the identified intent, which can then be found in the outgoing `-[:connected_to]->` relationships of the current <span class="label label-location">Location</span>.

# 6. Filtering by Scenario

The relationship `-[:belongs_to]->` is used for filtering the data for a specific <span class="label label-scenario">Scenario</span>. All <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span> and <span class="label label-overlay">Overlays</span> can also be used multiple times in different <span class="label label-scenario">Scenarios</span>.
