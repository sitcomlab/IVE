---
layout: post
title: Introducing the IVE v2
author: nicho
excerpt_separator: <!--more-->
---

> TL;DR: 2nd version is in development, everything will be more awesome!

Hi folks,

it's Nicho from the SitcomLab and I'm proud to announce the **2nd version** of the **Immersive Video Environment**! The development is currently in progress and a first prototype is already running. As the 1st version of the IVE (originally known as the *IPED-TOOLKIT*)  had some problems across the whole implementation, the 2nd version is a complete rebuild from scratch with a lot improvements under the hood.

<!--more-->

The original concept of a distributed client-server approach still exists. The following parts forms the system:

* the backend, which contains a webserver, a REST-API and the graph database, as well as a websocket-server for realtime communication
* an administrative UI to organize the data
* the frontend, which can play the panoramic videos and overlay them with virtual objects
* the remote control (web-app on a smartphone), which is used for navigation and interaction with the frontend.

The backend is also implemented in Nodejs, but I had to switch from the Neo4j database v2.1.8, which was the last stable version of the **IPED-TOOLKIT** to the latest v3.x, because the previous database drivers were not supported any more. The package we used, was community driven and was not supported officially by Neo4j. With the installation to the latest Neo4j database v3.x, the company introduced a new protocol (*Bolt*), which allowed them to built drivers for all major platforms, including Nodejs. If you are interested, please [here](https://neo4j.com/developer/language-guides/) is a the full overview about the official drivers.
Furthermore the websocket-server was rebuild and allows developers to create own extensions.

On the frontend side, I switched from Backbone.js to AngularJS (v1.5.x), which is currently one of the most popular MVC-frameworks and there are a lot of tutorials out there, which makes it easier for students and new developers to get into my code, when they want to extend and hack the IVE for their research. It also makes it easier to update the UI across all system parts and clients, thanks to it's two way-data binding. For more information, please check out the [AngularJS](https://angularjs.org) documentation.

Thanks to the new development, I was also able to the redesign the database schema, which fixed some shortcomings in the previous version:

* A new entity (or in Cypher-language: label) was introduced: `Scenarios`. It allows filtering Locations, Videos and Overlays by a Scenario and builds also the fundament for future extensions
* Overlays are no longer connected to locations, instead they are directly connected to videos, because a video must have a least one location. This approach allows you to embed the same overlay to different videos. Therefore the parameters of scaling, rotation and translation are no longer stored inside an Overlay object, they are now stored in the `-[:embedded_in]->` relationship.
* Renaming all relationships to make them more semantic, please see [this overview](/graph/#relationships) for more information about them
* Finally the problem of indoor locations, which lay close to each other on a map and could not be clicked properly, was solved by introducing a so called <span class="label label-abstract-location">abstract:Location</span>, which works as parent location, please read [this documentation](/graph/#parent-location-approach) to get more information about it.

###### Roadmap
* Backend: further REST-API endpoints, so that HTTP-requests are a second option to communicate with the server beside the websockets
* Backend: Administrative UI to setup and change Overlays
* Frontend: Rendering Overlays
* Remote control: settings view
* (Remote control: Voice control system)
* (Backend: Voice control system)

As I already mentioned at the beginning, the development is still in progress and some parts might change in the future. Please check out the materials of this blog and create some issues on GitHub, if you find some bugs. Your feedback and ideas are very welcome, feel free to get in touch with me and fork the project on GitHub.
