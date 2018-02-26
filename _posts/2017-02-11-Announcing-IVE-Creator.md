---
layout: post
title: Announcing the IVE-CREATOR
author: nicho
excerpt_separator: <!--more-->
---

> TL;DR: The CREATOR implementation has been started

<!--more-->

Hi there,

it's Nicho from the SitcomLab and I'm proud to announce, that the **CREATOR** of the **Immersive Video Environment** in mostly done! Therefore, many REST-API endpoints has been added to the IVE and a AngularJS based application has been implemented. The CREATOR can be used as an administrative UI, beside the Neo4j-Browser. You can easily create, edit and delete entries, like <span class="label label-scenario">Scenarios</span>, <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span>, <span class="label label-overlay">Overlays</span> and <span class="label label-default">Relationships</span>, without knowing the cypher commands for Neo4j.
The CREATOR can already be used, but one important part is still in progress and added soon. If you want the store the spatial orientation of an overlay inside a video, you can do it now manually. In the next update it will be possible to use a **review-mode**, in which you can drag and rotate an object by your mouse.

In the meantime, you are welcome to test the CREATOR, if you don't have time to setup it up, here are some screenshots of the current status:

[<img src="{{ site.baseurl }}/images/creator_1.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_2.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_3.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_4.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_5.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_6.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_7.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_8.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/creator_9.png" alt="CREATOR" class="picture bordered" />]({{ site.baseurl }}/)


###### Roadmap

* CREATOR: Preview-mode for Overlays
* VIEWER: Rendering Overlays
* REMOTE CONTROL: settings view
* (REMOTE CONTROL: Voice control system)
* (CREATOR: Voice control system)
