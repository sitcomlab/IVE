---
layout: page
title: Schemas
permalink: /schemas/
---

## Scenarios

***

## Locations

***

## Videos

#### CSV

Parameters:

* `v_id` <span class="label label-primary">required</span>
* `name` <span class="label label-primary">required</span>
* `url` <span class="label label-primary">required</span>
* `description` <span class="label label-default">optional</span>
* `description_international` <span class="label label-default">optional</span>
* `recorded` <span class="label label-default">optional</span>
* `s_id` <span class="label label-primary">required</span>

Example:

| v_id | name | url | description | description_international | recorded | s_id |
|------|------|-----|-------------|---------------------------|----------|------|
| v_20 | Heisenbergstraße (car entrance) | /media/videos/geo_1/heisenbergstrasse_car_entrance | Heisenbergstraße (Einfahrt) | Heisenbergstraße (car entrance) | | s_3 |
| v_21 | Heisenbergstraße (parking lots) | /media/videos/geo_1/heisenbergstrasse_parking_lots | Heisenbergstraße (Parkplatz) | Heisenbergstraße (parking lots) | | s_3 |
| v_22 | GEO-1 (main entrance) | /media/videos/geo_1/geo1_main_entrance | GEO-1 (Haupteingang) | GEO-1 (main entrance) | | s_3 |
| v_23 | Ground floor (atrium) | /media/videos/geo_1/geo1_ground_floor_atrium | Erdgeschoss (Atrium) | Ground floor (atrium) | | s_3 |
| v_24 | Ground floor (elevator) | /media/videos/geo_1/geo1-ground_floor_elevator | Erdgeschoss (Aufzug) | Ground floor (elevator) | | s_3 |
| v_25 | Ground floor (stairs) | /media/videos/geo_1/geo1-erdgeschoss-hintere-treppe | Erdgeschoss (Hintere Treppe) | Ground floor (stairs) | | s_3 |
| v_26 | Ground floor (IVVGeo) | /media/videos/geo_1/geo1-erdgeschoss-ivvgeo | Erdgeschoss (IVVGeo) | Ground floor (IVVGeo) | | s_3 |
| v_27 | Ground floor (2nd atrium) | /media/videos/geo_1/geo1-erdgeschoss-zweites-atrium | Erdgeschoss (2. Atrium) | Ground floor (2nd atrium) | | s_3 |
| v_28 | | | | | | |
| v_29 | | | | | | |
| v_30 | | | | | | |
| v_31 | | | | | | |
| v_32 | | | | | | |
| v_33 | | | | | | |



<!-- TODO:
	Ground floor (2nd atrium 2)	/media/videos/geo_1/geo1-erdgeschoss-zweites-atrium-2	Erdgeschoss (2. Atrium 2)	Ground floor (2nd atrium 2)		s_3

	Ground floor (lecture room)	/media/videos/geo_1/geo1-erdgeschoss-hoersaal	Erdgeschoss (Hörsaal)	Ground floor (lecture room)		s_3

	1st floor (atrium)	/media/videos/geo_1/geo1-erster-stock-atrium	1. Stock (Atrium)	1st floor (atrium)		s_3

	1st floor (stairwell)	/media/videos/geo_1/geo1-erster-stock-treppe	1. Stock (Treppenhaus)	1st floor (stairwell)		s_3

	2nd floor (stairwell)	/media/videos/geo_1/geo1-zweiter-stock-treppe	2. Stock (Treppenhaus)	2nd floor (stairwell)		s_3

	4th floor (stairwell)	/media/videos/geo_1/geo1-vierter-stock-treppe	4. Stock (Treppenhaus)	4th floor (stairwell)		s_3
-->

#### API

Request: <span class="label label-info">POST</span>

```
/api/videos
```

* Content-Type `application/json`
* Body:

```json
{
    "v_id": "v_20",
    "name": "Heisenbergstraße (car entrance)",
    "url": "/media/videos/geo_1/heisenbergstrasse_car_entrance",
    "description": "Heisenbergstraße (Einfahrt)",
    "description_international": "Heisenbergstraße (car entrance)",
    "recorded": null,
    "s_id": "s_3"
}
```

Response `201`:

```json
{
    "video_id": 1,
    "v_id": "v_20",
    "name": "Heisenbergstraße (car entrance)",
    "url": "/media/videos/geo_1/heisenbergstrasse_car_entrance",
    "description": "Heisenbergstraße (Einfahrt)",
    "description_international": "Heisenbergstraße (car entrance)",
    "recorded": null,
    "s_id": "s_3"
}
```
