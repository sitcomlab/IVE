---
layout: page
permalink: /expansion/
---

#### Overview
1. [Database](#database)
    1. [Extending nodes](#nodes)
    2. [Extending relationships](#extending-relationships)
2. [REST-API](#rest-api)
3. [Websockets](#websockets)
4. [Extensions](#extensions)
    1. [Voice control system](#voice-control-system)

***

# 1. Database

The underlaying graph structure is very flexible and easy to extend. Beside creating new nodes (entities) and relationships, it is also possible to extend the existing ones for your application. The following sections focus on this option.

## 1.1. Extending nodes

All nodes (<span class="label label-scenario">Scenarios</span>, <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span>, <span class="label label-overlay">Overlays</span>) have own properties. You can easily extend them with your own. If you have a new entity, for example: <span class="label label-user">Users</span>, which would bring own properties (for example: `username`, `password`, `first_name`, `last_name`, `email_address`), it is recommended to introduce a new node. With the help of a new relationship (for example: `-[HAS_ACCESS]->`) between a <span class="label label-user">User</span> and a <span class="label label-scenario">Scenario</span>, you would have built a simple authorization concept.

## 1.2. Extending relationships

All relationships can be weighted. In the example graph the property `weight` in the `-[CONNECTED_TO]->` relationship has the value `1.0` to demonstrate this concept. This property could also be used or renamed to `travel-minutes`, which could  then contain the minutes to go from one <span class="label label-location">Location</span> to another. For your application, you can simply extend the weights inside the relationships, they are fully customizable. Another example is the `-[EMBEDDED_IN]->` relationship, between an <span class="label label-overlay">Overlay</span> and a <span class="label label-video">Video</span>. All settings of the translation, rotation and scaling are saved inside the `-[EMBEDDED_IN]->` relationship, so a <span class="label label-overlay">Overlay</span> can used multiple times in different positions or different <span class="label label-video">Videos</span>, without duplicating an <span class="label label-overlay">Overlay</span> object.

***

# 2. REST-API

* Base-url: `/api/*`
* Headers:
    * `Content-Type: application/json` for the body of POST and PUT requests
    * `Authorization: Bearer <TOKEN>` for protected endpoints

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| **POST** | `/login` | | |
| **GET** | `/scenarios` | | |
| **POST** | `/scenarios` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/scenarios` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/scenarios/:scenario_id` | | |
| **PUT** | `/scenarios/:scenario_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/scenarios/:scenario_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/locations` | | |
| **POST** | `/locations` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/locations` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/locations/:location_id` | | |
| **PUT** | `/locations/:location_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/locations/:location_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/locations/:location_id/locations` | | |
| **GET** | `/scenarios/:scenario_id/locations` | | |
| **GET** | `/videos` | | |
| **POST** | `/videos` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/videos` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/videos/:video_id` | | |
| **PUT** | `/videos/:video_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/videos/:video_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/locations/:location_id/videos` | | |
| **GET** | `/scenarios/:scenario_id/locations` | | |
| **GET** | `/overlays` | | |
| **POST** | `/overlays` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/overlays` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/overlays/:overlay_id` | | |
| **PUT** | `/overlays/:overlay_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/overlays/:overlay_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/videos/:video_id/overlays` | | |
| **GET** | `/scenarios/:scenario_id/overlays` | | |
| **GET** | `/relationship/belongs_to/:labels` | | |
| **GET** | `/relationship/connected_to` | | |
| **GET** | `/relationship/embedded_in` | | |
| **GET** | `/relationship/has_parent_location` | | |
| **GET** | `/relationship/recorded_at` | | |
| **POST** | `/relationship/belongs_to/:label` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **POST** | `/relationship/connected_to` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **POST** | `/relationship/embedded_in` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **POST** | `/relationship/has_parent_location` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **POST** | `/relationship/recorded_at` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/relationship/belongs_to/:relationship_id/:label` | | |
| **GET** | `/relationship/connected_to/:relationship_id` | | |
| **GET** | `/relationship/embedded_in/:relationship_id` | | |
| **GET** | `/relationship/has_parent_location/:relationship_id` | | |
| **GET** | `/relationship/recorded_at/:relationship_id` | | |
| **PUT** | `/relationship/belongs_to/:relationship_id/:label` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **PUT** | `/relationship/connected_to/:relationship_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **PUT** | `/relationship/embedded_in/:relationship_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **PUT** | `/relationship/has_parent_location/:relationship_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **PUT** | `/relationship/recorded_at/:relationship_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **DELETE** | `/relationships/:relationship_id` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** or **DELETE** | `/reset` | <i class="fa fa-lock" aria-hidden="true"></i> | |
| **GET** | `/handlers/set/scenario/:scenario_id` | | |
| **GET** | `/handlers/set/location/:location_id'` | | |
| **GET** | `/handlers/set/video/:video_id` | | |

***

# 3. Websockets

| Endpoint | Message | Description |
|----------|---------|-------------|
| `/set/scenario` | `{ "scenario_id": 1 }` | Set the scenario inside the frontend application |
| `/set/location` | `{ "location_id": 2 }` | Set the (start-) location inside the frontend application |
| `/set/video` | `{ "video_id": 3 }` | Set (change) the current video inside the frontend application |
| `/toggle/overlay` | `{ "overlay_id": 4 }` | Show or hide the current overlay inside the frontend application |

***

# 4. Extensions

## 4.1. Voice control system

The IVE was extended by **Nicholas Schiestel** <a href="https://github.com/nicho90" target="_blank" class="link"><i class="fa fa-github-alt" aria-hidden="true"></i></a> <a href="https://twitter.com/Nicho_S_90" target="_blank" class="link"><i class="fa fa-twitter" aria-hidden="true"></i></a> with a voice control system as part of his bachelor thesis.
The following image shows the basic architecture of the implementation.

[<img src="{{ site.baseurl }}/images/voice-control.svg" alt="Voice control system" class="picture" />]({{ site.baseurl }}/)

The voice control system uses the expressions <-> intents concept, so a user can say different commands (expressions), but the meaning (intent) are all the same. Based on this concept, multiple intents can be used to navigate inside the IVE. The property `intent_id` inside a `-[CONNECTED_TO]->` relationship is used as a reference-key. In a second relational database ([PostgreSQL](https://www.postgresql.org)), the `intent_id` is unique and contains all possible intents. If a spoken voice command (expression) was identified by the external voice recognition system ([Wit.Ai](https://wit.ai)), the external voice recognition system tries to find the intent, which the expression is related to. It sends the identified intent (e.g. `go_left`) back to the IVE-Server, where a simple algorithm tries to found the intent inside all outgoing `-[CONNECTED_TO]->` relationships of the current <span class="label label-location">Location</span>. If there is a match, the IVE goes to the new location and switch the video.
