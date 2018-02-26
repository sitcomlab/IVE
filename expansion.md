---
layout: page
permalink: /expansion/
---

#### Overview
1. [Database](#database)
    1. [Extending nodes](#nodes)
    2. [Extending relationships](#extending-relationships)
2. [REST-API](#rest-api)
    1. [Postman](#postman)
    2. [Endpoints](#endpoints)
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

## 2.1. Postman

All data can be accessed by a REST-API. You can easily test out the endpoints with the program [Postman](https://www.getpostman.com). Install it as a client or as an [Google Chrome extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).
In the folder `/rest/*` inside the repository, you can find two files, which can be imported to Postman. Import one of these files into Postman, like in the picture below or use the following button to download it automatically:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/49c3353265bbafb1bb96)

[<img src="{{ site.baseurl }}/images/postman.png" alt="Postman" class="picture" />]({{ site.baseurl }}/)

## 2.2. Endpoints

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
| **GET** | `/relationship/belongs_to/:label` | | |
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
| `/set/scenario` | `{ "scenario_id": 1 }` | Set the scenario inside the VIEWER |
| `/set/location` | `{ "location_id": 2 }` | Set the (start-) location inside the VIEWER |
| `/set/video` | `{ "video_id": 3 }` | Set (change) the current video inside the VIEWER |
| `/toggle/overlay` | `{ "overlay_id": 4 }` | Show or hide the current overlay inside the VIEWER |

***

# 4. Extensions

## 4.1. Voice control system

The IVE was extended by **Nicholas Schiestel** <a href="https://github.com/nicho90" target="_blank" class="link"><i class="fa fa-github-alt" aria-hidden="true"></i></a> <a href="https://twitter.com/Nicho_S_90" target="_blank" class="link"><i class="fa fa-twitter" aria-hidden="true"></i></a> with a voice control system as part of his bachelor thesis.
The following image shows the basic architecture of the implementation.

[<img src="{{ site.baseurl }}/images/voice-control.svg" alt="Voice control system" class="picture" />]({{ site.baseurl }}/)

The voice control system uses the **expressions <-> intents** approach. This means a user can give a variation of voice commands (expressions), for example: "Go left" or "Turn left". But these commands have all the same meaning, for example: "navigate_left", which allows to aggregate them into a single intent. If one of those expression is matched during the voice recognition phase, the identified intent is sent back from the voice recognition system ([Wit.Ai](https://wit.ai)) to the IVE. Based on this idea multiple intents, which different meanings (for example: "go_left", "go_right", etc.) can be used to build a simple  navigation system for the IVE. The property `intents` inside the `-[CONNECTED_TO]->` relationship is an array, which contains all available intents for this relationship. Based on this, all out-going `-[CONNECTED_TO]->` relationships of the current <span class="label label-location">Location</span> can be searched for the intent name, the voice recognition system had identified. If the intent can be found inside the relationships, the system can navigate to the connected <span class="label label-location">Location</span>. One requirement for this simple search algorithm it that all intent names have to be unique.
