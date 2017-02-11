---
layout: post
title: Announcing the IVE-Backend
author: nicho
excerpt_separator: <!--more-->
---

> TL;DR: The IVE-Backend implementation is about to be completed soon

<!--more-->

Hi there,

it's Nicho from the SitcomLab and I'm proud to announce, that the **IVE-Backend** of the **Immersive Video Environment** in mostly done! Therefore, many REST-API endpoints has been added to the IVE and a AngularJS based application has been implemented. The IVE-Backend can be used as an administrative UI, beside the Neo4j-Browser. You can easily create, edit and delete entries, like <span class="label label-scenario">Scenarios</span>, <span class="label label-location">Locations</span>, <span class="label label-video">Videos</span>, <span class="label label-overlay">Overlays</span> and <span class="label label-default">Relationships</span>, without knowing the cypher commands for Neo4j.
The IVE-Backend can already be used, but one important part is still in progress and added soon. If you want the store the spatial orientation of an overlay inside a video, you can do it now manually. In the next update it will be possible to use a **review-mode**, in which you can drag and rotate an object by your mouse.

In the meantime, you are welcome to test the IVE-Backend, if you don't have time to setup it up, here are some screenshots of the current status:

[<img src="{{ site.baseurl }}/images/backend_1.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_2.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_3.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_4.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_5.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_6.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_7.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_8.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)

[<img src="{{ site.baseurl }}/images/backend_9.png" alt="IVE-Backend" class="picture bordered" />]({{ site.baseurl }}/)


###### Roadmap

* Backend: Preview-mode for Overlays
* Frontend: Rendering Overlays
* Remote control: settings view
* (Remote control: Voice control system)
* (Backend: Voice control system)
