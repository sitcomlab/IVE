---
layout: page
permalink: /relationships/
---


### Overview
1. [Example graph](#example-graph)
2. [Main relationships](#main-relationships)
3. [Parent location approach](#parent-location-approach)
4. [Weighting for relationships](#weighting-for-relationships)
5. [Filtering by Scenario](#filtering-by-scenario)

***


# Example graph


[<img src="{{ site.baseurl }}/images/graph_overview.png" alt="graph overview" style="width: 100%;"/>]({{ site.baseurl }}/)

# Main relationships

* <span class="label label-location">i/o:Location</span> *(1)* `-[:belongs_to]->` *(1..n)* <span class="label label-scenario">Scenario</span>
* <span class="label label-location">i/o:Location</span> *(1)* `-[:connected_to]->` *(1..n)* <span class="label label-location">i/o:Location</span>
* <span class="label label-location">i/o:Location</span> *(1)* `-[:parent_location]->` *(1)* <span class="label label-abstract-location">abstract:Location</span>
* <span class="label label-video">Video</span> *(1)* `-[:belongs_to]->` *(1..n)* <span class="label label-scenario">Scenario</span>
* <span class="label label-video">Video</span> *(1)* `-[:recorded_at]->` *(1)* <span class="label label-location">i/o:Location</span>
* <span class="label label-overlay">Overlay</span> *(1)* `-[:belongs_to]->` *(1..n)* <span class="label label-scenario">Scenario</span>
* <span class="label label-overlay">Overlay</span> *(1)* `-[:embedded_in]->` *(1..n)* <span class="label label-video">Video</span>


# Parent location approach

It is easy to connect <span class="label label-location">outdoor:Locations</span> with a `-[:connected_to]->` relationship:

[<img src="{{ site.baseurl }}/images/1_outdoor.png" alt="graph overview" style="width: 100%;"/>]({{ site.baseurl }}/)

But when it comes to <span class="label label-location">indoor:Locations</span> it is difficult to draw them on a map, because the coordinates are very close to each other. The following graph demonstrates the problem with <span class="label label-location">i/o:Locations</span> (GEO-1 building of the Institute for Geoinformatics):

[<img src="{{ site.baseurl }}/images/2_fail.png" alt="graph overview" style="width: 100%;"/>]({{ site.baseurl }}/)

To provide a map with single marker representations for <span class="label label-location">indoor:Locations</span>, it is necessary to aggregate them:

[<img src="{{ site.baseurl }}/images/3_indoor.png" alt="graph overview" style="width: 100%;"/>]({{ site.baseurl }}/)

Therefore each <span class="label label-location">indoor:Location</span> has to be connected with the relationship `-[:parent_location]->` to a so called <span class="label label-abstract-location">abstract:Location</span>.
An <span class="label label-abstract-location">abstract:Location</span> acts as a "coordinate provider", so all <span class="label label-location">indoor:Locations</span> can have empty coordinates (`lng: 0.0, lat: 0.0`).
It is highly recommended to use for all <span class="label label-location">indoor:Locations</span> an <span class="label label-abstract-location">abstract:Location</span>, so that the transition between <span class="label label-location">i/o:Locations</span> comes clear.

For specifying a <span class="label label-location">Location</span> use the `location_type` property, which can have the values:
* `indoor`
* `outdoor`
* `abstract`

The parent location approach also allows the normal usage of `-[:connected_to]->` relationships between
<span class="label label-location">indoor:Locations</span> as well as <span class="label label-location">outdoor:Locations</span>. The following example shows an example graph of the GEO-1 building and the relationships between the <span class="label label-location">Locations</span>:

[<img src="{{ site.baseurl }}/images/parent_location.png" alt="main relationships" style="width: 100%;"/>]({{ site.baseurl }}/)


# Weighting for relationships

All relationships can be weighted. For example, the `-[:connected_to]->` relationship could be extended with a property `travel-minutes`, which contains the minutes to go from one <span class="label label-location">Location</span> to another. The properties of relationships are fully customizable, so that you can extend them in your application. For example, the property `intents:["go_left", "enter_room"]` of the `-[:connected_to]->` relationship is used in the voice control extension. If a voice command was identified by a voice recognition system to an intent, this intent can be found in the out-going `-[:connected_to]->` relationships of the current <span class="label label-location">Location</span>.
Another example is the `-[:embedded_in]->` relationship, between an <span class="label label-overlay">Overlay</span> and a <span class="label label-video">Video</span>. All settings of the translation, rotation and scaling are saved inside the `-[:embedded_in]->` relationship, so a <span class="label label-overlay">Overlay</span> can used mutiple times in different positions or different <span class="label label-video">Videos</span>.

# Filtering by Scenario

The relationship `-[:belongs_to]->` is used for filtering the data for a specific <span class="label label-scenario">Scenario</span>. All <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span> and <span class="label label-overlay">Overlays</span> can also be used multiple times in different <span class="label label-scenario">Scenarios</span>.
