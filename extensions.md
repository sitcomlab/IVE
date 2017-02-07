---
layout: page
permalink: /extensions/
---

#### Overview
1. [Introduction](#introduction)
    1. [Extending nodes](#nodes)
    2. [Extending relationships](#extending-relationships)
2. [Voice control system](#voice-control-system)

***

# 1. Introduction

The underlaying graph structure is very flexible and easy to extend. Beside creating new nodes (entities) and relationships, it is also possible to extend the existing ones for your application. The following sections focus on this option.

## 1.1. Extending nodes

All nodes (<span class="label label-scenario">Scenarios</span>, <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span>, <span class="label label-overlay">Overlays</span>) have own properties. You can easily extend them with your own. If you have a new entity, for example: <span class="label label-user">Users</span>, which would bring own properties (for example: `username`, `password`, `first_name`, `last_name`, `email_address`), it is recommended to introduce a new node. With the help of a new relationship (for example: `-[HAS_ACCESS]->`) between a <span class="label label-user">User</span> and a <span class="label label-scenario">Scenario</span>, you would have built a simple authorization concept.

## 1.2. Extending relationships

All relationships can be weighted. In the example graph the property `weight` in the `-[CONNECTED_TO]->` relationship has the value `1.0` to demonstrate this concept. This property could also be used or renamed to `travel-minutes`, which could  then contain the minutes to go from one <span class="label label-location">Location</span> to another. For your application, you can simply extend the weights inside the relationships, they are fully customizable. Another example is the `-[EMBEDDED_IN]->` relationship, between an <span class="label label-overlay">Overlay</span> and a <span class="label label-video">Video</span>. All settings of the translation, rotation and scaling are saved inside the `-[EMBEDDED_IN]->` relationship, so a <span class="label label-overlay">Overlay</span> can used multiple times in different positions or different <span class="label label-video">Videos</span>, without duplicating an <span class="label label-overlay">Overlay</span> object.

***

# 2. Voice control system

The IVE was extended by **Nicholas Schiestel** <a href="https://github.com/nicho90" target="_blank" class="link"><i class="fa fa-github-alt" aria-hidden="true"></i></a> <a href="https://twitter.com/Nicho_S_90" target="_blank" class="link"><i class="fa fa-twitter" aria-hidden="true"></i></a> with a voice control system as part of his bachelor thesis.
The following image shows the basic architecture of the implementation.

[<img src="{{ site.baseurl }}/images/voice-control.svg" alt="Voice control system" class="picture" />]({{ site.baseurl }}/)

The voice control system uses the expressions <-> intents concept, so a user can say different commands (expressions), but the meaning (intent) are all the same. Based on this concept, multiple intents can be used to navigate inside the IVE. The property `intent_id` inside a `-[CONNECTED_TO]->` relationship is used as a reference-key. In a second relational database ([PostgreSQL](https://www.postgresql.org)), the `intent_id` is unique and contains all possible intents. If a spoken voice command (expression) was identified by the external voice recognition system ([Wit.Ai](https://wit.ai)), the external voice recognition system tries to find the intent, which the expression is related to. It sends the identified intent (e.g. `go_left`) back to the IVE-Server, where a simple algorithm tries to found the intent inside all outgoing `-[CONNECTED_TO]->` relationships of the current <span class="label label-location">Location</span>. If there is a match, the IVE goes to the new location and switch the video.
